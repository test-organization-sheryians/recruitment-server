import PasswordService from "../services/password.service.js"
import { AppError } from "../utils/errors.js"

class PasswordController {
  constructor() {
    this.passwordService = new PasswordService()

    this.forgotPassword = this.forgotPassword.bind(this)
    this.resetPassword = this.resetPassword.bind(this)
  }

  forgotPassword = async (req, res, next) => {
    try {
      const response = await this.passwordService.forgotPassword(req.body.email)

      if (!response) {
        return res.status(400).json({
          message: "something went wrong in forgot-password",
        })
      }

      return res.status(200).json({
        success: true,
        message: "Reset link sent successfully",
      })
    } catch (err) {
      next(err)
    }
  }

  resetPassword = async (req, res, next) => {
    try {
      const { token, newPassword, confirmPassword } = req.body

      if (!newPassword || !confirmPassword) {
        throw new AppError("Password is required", 400)
      }

      if (newPassword !== confirmPassword) {
        throw new AppError("Passwords do not match", 400)
      }

      const response = await this.passwordService.resetPassword(token, newPassword)

      console.log(response)
      if (!response) {
        message: "something went wrong in reset password"
      }
      return res.status(200).json({
        success: true,
        message: "Password reset successful",
      })
    } catch (err) {
      next(err)
    }
  }
}

export default new PasswordController()
