import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import jobRoleRoutes from "./routes/jobRole.routes.js";
import candidateProfileRoutes from "./routes/candidateProfile.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import cookieParser from "cookie-parser";
import jobCategoryRoutes from "./routes/jobCategory.routes.js";
import expereniceRoutes from "./routes/experience.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { corsOptions } from "./config/corsOptions.js";
import jobapply from "./routes/jobApplication.routes.js";
import jobApplicationModel from "./models/jobApplication.model.js";
import { authenticateJWT } from "./middlewares/auth.middleware.js";
import testRoutes from "./routes/test.routes.js";
import testEnrollmentRoutes from "./routes/TestEnrollment.routes.js";
import testAttemptRoutes from "./routes/testAttempts.routes.js";
import awsRouter from './routes/aws.route.js'
import resendMailRoutes from "./routes/resendMail.routes.js";
import ScheduleInterviewRoutes from "./routes/scheduleInterview.routes.js";
import blogPostRoutes from "./routes/blogPost.routes.js";
import savedJobRoutes from "./routes/savedJob.routes.js";
import passwordRoutes from "./routes/password.routes.js";
import jobApplicationQuesition from "./routes/jobApplicationQuesition.route.js";
import productRoutes from "./routes/product.routes.js";

// import deleteTestsRoutes from "./routes/delete-tests.routes.js";

import adminProfileRoutes from "./routes/adminProfile.routes.js";

import ViolationRoutes  from "./routes/testViolation.routes.js";
import shareCandidate from "./routes/shareCandidate.routes.js";
import tokenRoutes from "./routes/token.route.js"
import categoryRoutes from "./routes/category.routes.js";
import adminProfileRoutes from "./routes/adminProfile.routes.js";
import readerRoutes from "./routes/reader.routes.js";
const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/jobs", jobRoleRoutes);     // add new route inside it
app.use("/api/job-categories", jobCategoryRoutes);
app.use("/api/job-apply", jobapply);
app.use("/api/skills", skillRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/experience", expereniceRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/enrollments", testEnrollmentRoutes);
app.use("/api/test-attempts", testAttemptRoutes);
app.use('/api/candidate-profile', candidateProfileRoutes);
app.use("/api/admin-profile", adminProfileRoutes);
app.use('/api/aws' , awsRouter)
app.use("/api/auth", resendMailRoutes);
// app.use("/api/tests", deleteTestsRoutes);
app.use("/api/interviews", ScheduleInterviewRoutes);
//   to: "agr.rbih@gmail.com",
//   name: "Rohan",
//   jobTitle: "Frontend Developer",
//   appliedAt: new Date()
// });

app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/job-questions",jobApplicationQuesition)

app.use('/api/ai/', ViolationRoutes)
app.use('/api/share', shareCandidate);
app.use("/api/token",tokenRoutes)



app.use("/api/blogs", blogPostRoutes);


app.use("/api/categories", categoryRoutes);


app.use("/api/products", productRoutes);

app.use(errorHandler);
export default app;
