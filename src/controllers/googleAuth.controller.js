import jwt from "jsonwebtoken";

class AuthController {
  static googleAuthCallback(req, res) {
    
    try {
      const user = req.user;

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          role: user.roleId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.redirect(
        `${process.env.CLIENT_URL}/auth/success?token=${token}`
      );
    } catch (err) {
      return res.status(500).json({
        message: "Auth failed",
        error: err.message,
      });
    }
  }

  static authFailed(req, res) {
    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }

  static getMe(req, res) {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  }
}

export default AuthController;