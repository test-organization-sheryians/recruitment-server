import crypto from "crypto"
import bcrypt from "bcryptjs"
import { AppError } from "../utils/errors.js"
import MongoUserRepository from "../repositories/implementations/mongoUserRepository.js"
import { emailQueue } from "../queues/emailQueue.js"
import logger from "../utils/logger.js"

class PasswordService {
  constructor() {
    this.userRepository = new MongoUserRepository()
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findUserByEmail(email)

    if (!user) {
      throw new AppError("Email not registered", 404)
    }

    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")

    const expires = new Date(Date.now() + 15 * 60 * 1000)

    await this.userRepository.updateResetToken(user._id, hashedToken, expires)

    try {
      // ADD JOB TO BULLMQ QUEUE — DO NOT SEND EMAIL DIRECTLY
      await emailQueue.add(
        "reset-password",
        {
          to: user.email,
          name: user.firstName || "User",
          token: rawToken,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        }
      )

      logger.info(`Reset password email job queued`, {
        email: user.email,
        userId: user._id.toString(),
      })
    } catch (error) {
      logger.warn("Failed to queue reset password email", {
        email: user.email,
        userId: user._id.toString(),
        error: error.message,
      })
    }

    return true
  }

  async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await this.userRepository.findByResetToken(hashedToken)

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400)
    }

    
  // ✅ CHECK: new password vs old password
  const isSamePassword = await bcrypt.compare(newPassword, user.password)

  if (isSamePassword) {
    throw new AppError(
      "New password cannot be the same as the old password",
      400
    )
  }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await this.userRepository.updateUser(user._id, {
      password: hashedPassword,
    })

    await this.userRepository.clearResetToken(user._id)

    return true
  }
}

export default PasswordService