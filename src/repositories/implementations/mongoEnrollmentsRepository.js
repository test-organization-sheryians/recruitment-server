import TestEnrollments from "../../models/TestEnrollments.js";
import { AppError } from "../../utils/errors.js";
import IEnrollment from "../contracts/IEnrollment.js";

class MongoEnrollmentsRespository extends IEnrollment {
  async enrollUser(testId, email) {
    try {
      const newEnrollment = new TestEnrollments({ testId, email });
      return await newEnrollment.save();
    } catch (error) {
      throw new AppError(
        `Failed to enroll user in test: ${error.message}`,
        500,
        error
      );
    }
  }

  async findEnrollment(testId, email) {
    try {
      return await TestEnrollments.findOne({ testId, email }).lean()
    } catch (error) {
      //  ✅ DUPLICATE (unique index exists)
      if (error.code === 11000) {
        return null
      }

      // ❌ NEVER expose DB error
      throw new AppError("Unable to enroll user at the moment.", 500)
    }
  }



// async findEnrollmentsByUser(email) {
//   try {
//     const enrollments = await TestEnrollments.aggregate([
//       {
//         $match: { email: email },
//       },
//       {
//         $lookup: {
//           from: "tests",
//           localField: "testId",
//           foreignField: "_id",
//           as: "test",
//         },
//       },
//       {
//         $unwind: {
//           path: "$test",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//     ]);

//     return enrollments;
//   } catch (error) {
//     throw error;
//   }
// }


  // async findEnrollmentsByUser(email) {
  //   try {
  //     const [enrollments] = await TestEnrollments.aggregate([
  //       {
  //         $match: { email: email },
  //       },
  //       {
  //         $lookup: {
  //           from: "tests",
  //           localField: "testId",
  //           foreignField: "_id",
  //           as: "tests",
  //         },
  //       },
  //       {
  //         $unwind: { path: "$tests", preserveNullAndEmptyArrays: true },
  //       },
  //     ]);

  //     return enrollments;
  //   } catch (error) {
  //     throw new AppError(
  //       `Failed to find user enrollments: ${error.message}`,
  //       500,
  //       error
  //     );
  //   }
  // }

 async findEnrollmentsByUser(email) {
    try {
      const enrollments = await TestEnrollments.aggregate([
        {
          $match: { email: email },
        },
        {
          $lookup: {
            from: "tests",
            localField: "testId",
            foreignField: "_id",
            as: "test",
          },
        },
        {
          $unwind: {
            path: "$test",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "testattempts",
            let: { testId: "$test._id", email: "$email" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$testId", "$$testId"] }, { $eq: ["$email", "$$email"] }],
                  },
                },
              },
              { $project: { _id: 1 } }, // Only need _id to check existence
            ],
            as: "userAttempts",
          },
        },
        {
          $addFields: {
            hasAttempt: { $gt: [{ $size: "$userAttempts" }, 0] },
          },
        },
        {
          $project: {
            userAttempts: 0, // ❌ remove array from final output
          },
        },
      ])

      return enrollments
    } catch (error) {
      throw error
    }
  }


  async bulkCreateEnrollment(testId, emails) {
    try {
      // 1️⃣ Find already enrolled emails
      const existing = await TestEnrollments.find({
        testId,
        email: { $in: emails.map((e) => e.toLowerCase().trim()) },
      })
        .select("email")
        .lean()

      const existingEmails = new Set(existing.map((e) => e.email))

      // 2️⃣ Keep only new emails
      const newEmails = emails
        .map((e) => e.toLowerCase().trim())
        .filter((e) => !existingEmails.has(e))

      if (newEmails.length === 0) {
        return {
    insertedCount: 0,
    skippedCount: emails.length,
    newEmails: [],
  }
      }

      // 3️⃣ Insert only new ones
      const operations = newEmails.map((email) => ({
        insertOne: {
          document: {
            testId,
            email,
            enrolledAt: new Date(),
          },
        },
      }))

      const result = await TestEnrollments.bulkWrite(operations, {
        ordered: false,
      })

      return {
        insertedCount: result.insertedCount,
        skippedCount: emails.length - newEmails.length,
        newEmails,
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      throw new AppError("Unable to enroll users at the moment.", 500)
    }
  }
}

export default MongoEnrollmentsRespository;
