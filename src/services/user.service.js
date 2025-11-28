import MongoUserRepository from "../repositories/implementations/mongoUserRepository.js";
import RedisCacheRepository from "../repositories/implementations/redisCacheRepository.js";
import { AppError } from "../utils/errors.js";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";
import bcrypt from "bcryptjs";

const { JWT_SECRET, REFRESH_SECRET, REFRESH_EXPIRES_IN } = config;

class UserService {
  constructor() {
    this.userRepository = new MongoUserRepository();
    this.cacheRepository = new RedisCacheRepository();
  }

  async saveRefreshToken(userId, refreshToken) {
    await this.cacheRepository.set(
      `refresh:${userId}`,
      refreshToken,
      7 * 24 * 3600
    );
  }

  // Helper: Safe role object for cache & JWT
  _getSafeRole(user) {
    return user.role
      ? {
          _id: user.role._id,
          name: user.role.name,
          description: user.role.description,
        }
      : null;
  }

  // Helper: Safe user payload
  _getSafeUserPayload(user) {
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || null,
      role: this._getSafeRole(user),
    };
  }

  async register(userData) {
    console.log(userData, "This is userData");

    const email = userData.email.toLowerCase().trim();
    const cacheKey = `user:email:${email}`;

    let existingUser = null;

    // 1. Try cache
    const cached = await this.cacheRepository.get(cacheKey);
    if (cached) {
      try {
        existingUser = JSON.parse(cached);
      } catch (e) {
        console.warn("Corrupted cache for email:", email);
        await this.cacheRepository.del(cacheKey);
      }
    }

    // 2. If not in cache → check DB
    if (!existingUser) {
      existingUser = await this.userRepository.findUserByEmail(email);
      if (existingUser) {
        // Cache it as stringified JSON
        await this.cacheRepository.set(
          cacheKey,
          JSON.stringify(existingUser),
          3600
        );
      }
    }

    // 3. If still exists → reject
    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    // 4. Create user
    const user = await this.userRepository.createUser({
      ...userData,
      email,
    });

    const userWithRole = await this.userRepository.findUserById(user._id);
    console.log(
      userWithRole,
      user._id,
      "this is fetched user after creatation"
    );
    if (!userWithRole) throw new AppError("Failed to fetch created user", 500);

    const safeUser = this._getSafeUserPayload(userWithRole);

    // 5. Cache both ID and email
    await this.cacheRepository.set(
      `user:id:${userWithRole._id}`,
      JSON.stringify(safeUser),
      3600
    );
    await this.cacheRepository.set(
      cacheKey,
      JSON.stringify({ ...safeUser, password: user.password }),
      3600
    );

    console.log(safeUser, "Register");
    // 6. JWT + Refresh Token
    const jwtPayload = {
      id: safeUser._id,
      email: safeUser.email,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      role: safeUser?.role?.name,
    };

    const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: userWithRole._id }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });

    await this.saveRefreshToken(userWithRole._id, refreshToken);

    return { user: safeUser, token, refreshToken };
  }

  async login({ email, password }) {
    console.log(email);
    // const cacheKey = `user:email:${email}`;
    // let cached = await this.cacheRepository.get(cacheKey);

    // let user;
    // if (cached) {
    //   user = JSON.parse(cached); // we have to check this one as sometimes while hitting login it uses json.parse and on some cases it uses user= cached !!
    //   // user = cached
    //    // changed this because there the cached was already an json due to which it was getting converted into [object object]
    //   // Re-attach comparePassword method
    //   user.comparePassword = async (pwd) => bcrypt.compare(pwd, user.password);
    // } else {
    let user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new AppError("Invalid credentials", 401);

    // const safeUser = this._getSafeUserPayload(user);
    // await this.cacheRepository.set(
    //   cacheKey,
    //   JSON.stringify({ ...safeUser, password: user.password }),
    //   3600
    // );
    // }

    user.comparePassword = async (pwd) => bcrypt.compare(pwd, user.password);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    const userWithRole = await this.userRepository.findUserById(user._id);
    if (!userWithRole) throw new AppError("Failed to authenticate user", 500);

    const safeUser = this._getSafeUserPayload(userWithRole);

    // await this.cacheRepository.set(`user:id:${userWithRole._id}`, JSON.stringify(safeUser), 3600);
    // await this.cacheRepository.set(`user:email:${userWithRole.email}`, JSON.stringify(safeUser), 3600);

    const jwtPayload = {
      id: safeUser._id,
      email: safeUser.email,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      role: safeUser?.role?.name,
    };
    console.log(jwtPayload, "login");

    const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: userWithRole._id }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });
    await this.saveRefreshToken(userWithRole._id, refreshToken);

    return {
      user: safeUser,
      token,
      refreshToken,
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new AppError("Unauthorized", 401);

    let payload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
      throw new AppError("Invalid refresh token", 401);
    }

    const stored = await this.cacheRepository.get(`refresh:${payload.id}`);
    if (!stored || stored !== refreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    const user = await this.userRepository.findUserById(payload.id);
    if (!user) throw new AppError("User not found", 404);

    const jwtPayload = { id: user._id };
    if (user.role) {
      jwtPayload.role = this._getSafeRole(user);
    }

    const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "1h" });

    const newRefreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });

    await this.saveRefreshToken(user._id, newRefreshToken);

    return { token, refreshToken: newRefreshToken };
  }

  async getUser(id) {
    const cacheKey = `user:id:${id}`;
    const cached = await this.cacheRepository.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.userRepository.findUserById(id);
    if (!user) throw new AppError("User not found", 404);

    const safeUser = this._getSafeUserPayload(user);
    await this.cacheRepository.set(cacheKey, JSON.stringify(safeUser), 3600);

    return safeUser;
  }

  async updateUser(id, userData) {
    const user = await this.userRepository.updateUser(id, userData);
    if (!user) throw new AppError("User not found", 404);

    const safeUser = this._getSafeUserPayload(user);

    await this.cacheRepository.set(
      `user:id:${id}`,
      JSON.stringify(safeUser),
      3600
    );

    if (userData.email && userData.email !== user.email) {
      await this.cacheRepository.del(`user:email:${userData.email}`);
    }
    await this.cacheRepository.set(
      `user:email:${user.email}`,
      JSON.stringify(safeUser),
      3600
    );

    return safeUser;
  }

  async updateMe(userId, updates) {
    if (!userId) throw new AppError("Unauthorized", 401);

    const updated = await this.userRepository.updateUser(userId, updates);
    if (!updated) throw new AppError("User not found", 404);

    const safeUser = this._getSafeUserPayload(updated);

    await this.cacheRepository.set(
      `user:id:${userId}`,
      JSON.stringify(safeUser),
      3600
    );

    const oldEmailKey = updates.email ? `user:email:${updates.email}` : null;

    await this.cacheRepository.set(
      `user:email:${updated.email}`,
      JSON.stringify({ ...safeUser, password: updated.password }),
      3600
    );

    if (oldEmailKey && updates.email !== updated.email) {
      await this.cacheRepository.del(oldEmailKey);
    }

    return safeUser;
  }

  async resetPassword(userId, oldPassword, newPassword) {
    const user = await this.userRepository.findUserById(userId, {
      select: "+password",
    });
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new AppError("Old password is incorrect", 400);

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updateUser(userId, { password: hashed });

    await this.cacheRepository.del(`user:id:${userId}`);
    await this.cacheRepository.del(`user:email:${user.email}`);

    return true;
  }
}

export default UserService;
