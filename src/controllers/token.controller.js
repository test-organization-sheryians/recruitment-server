import TokenService from "../services/token.service.js";
import jwt from "jsonwebtoken"
import config from "../config/environment.js"
import { AppError } from "../utils/errors.js";

const { JWT_SECRET, REFRESH_SECRET, REFRESH_EXPIRES_IN } = config;

class TokenController {
  constructor() {
    this.tokenController = new TokenService();
  }

  createToken = async (req, res, next) => {
    try {
      // const userId = req.userId;

      const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
      console.log("get the token from cookie check the user id  ===>", token)

      let decode = await jwt.verify(token, JWT_SECRET)
      console.log("check the decode of token ===>", decode.id)

      const userId = decode?.id
      console.log("user id for comparison ==>", userId)
      const response = await this.tokenController.createToken(userId);

      if(response.user.isVerified===false){
        return res.status(500).json({
          message:"User is not verified yet"
        })
      }


      res.cookie("token", response.token, {
        ...this.cookieOptions,
        maxAge: 60 * 60 * 1000,

      });

      res.cookie("refreshToken", response.refreshToken, {
        ...this.cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        message: "Token update successfully.",
        data: response
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TokenController;
