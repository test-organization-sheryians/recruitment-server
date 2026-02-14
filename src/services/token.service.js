import MongoTokenRepository from "../repositories/implementations/mongoTokenRepository.js"
import config from "../config/environment.js"
import jwt from "jsonwebtoken"
const { JWT_SECRET, REFRESH_SECRET, REFRESH_EXPIRES_IN } = config;


class TokenService {
  constructor() {
    this.tokenservice = new MongoTokenRepository()
  }

  _getSafeRole(user) {
    return user.role
      ? {
        _id: user.role._id,
        name: user.role.name,
        description: user.role.description,
      }
      : null;
  }

  _getSafeUserPayload(user) {
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || null,
      role: this._getSafeRole(user),
      isVerified: user.isVerified,
    };
  }

  async createToken(userId) {
    const user = await this.tokenservice.createToken(userId)

    if (!user) throw new AppError("Failed to authenticate user", 500);

    const safeUser = this._getSafeUserPayload(user);

    const jwtPayload = {
      id: safeUser._id,
      email: safeUser.email,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      role: safeUser?.role?.name,
      isVerified: safeUser?.isVerified,
    };


    const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });

    return {
      user,
      token,
      refreshToken,
    };
  }



}

export default TokenService