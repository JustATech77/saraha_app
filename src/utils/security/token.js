import jwt from "jsonwebtoken";
import { UserModel } from "../../config/models/user.model.js";
import * as DBservice from "../../config/db.service.js";
import { nanoid } from "nanoid";
import { TokenModel } from "../../config/models/token.model.js";
export const tokenTypeEnum = { access: "access", refresh: "refresh" };
export const logoutEnum = {
  signOutFromAll: "allDevices",
  signout: "signout",
  stayLoggedIn: "",
};

export const generateToken = async ({
  payload,
  secretKey = process.env.ACCESS_TOKEN_SIGNATURE,
  options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) },
} = {}) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = async ({
  token,
  secretKey = process.env.ACCESS_TOKEN_SIGNATURE,
} = {}) => {
  return jwt.verify(token, secretKey);
};

export const decodeToken = async ({
  next,
  authorization = "",
  tokenType = tokenTypeEnum.access,
} = {}) => {
  const [bearer, token] = authorization?.split(" ") || [];
  if (!bearer || !token) {
    return next(new Error("missing token parts", { cause: 401 }));
  }
  if (bearer !== "Bearer") {
    return next(new Error("Invalid token prefix", { cause: 401 }));
  }

  const secretKey =
    tokenType === tokenTypeEnum.access
      ? process.env.ACCESS_TOKEN_SIGNATURE
      : process.env.REFRESH_TOKEN_SIGNATURE;

  const decoded = await verifyToken({ token, secretKey });

  const checkTokenLogout = await DBservice.findOne({
    model: TokenModel,
    filter: {
      jti: decoded.jti,
    },
  });

  if (checkTokenLogout) {
    return next(new Error("Invalid Login credentials", { cause: 401 }));
  }

  if (!decoded) {
    return next(new Error("In-valid token", { cause: 401 }));
  }
  if (!decoded?._id) {
    return next(new Error("In-valid token payload", { cause: 401 }));
  }

  const user = await DBservice.findById({
    model: UserModel,
    id: decoded._id,
  });

  if (!user) {
    return next(new Error("Not registered user", { cause: 404 }));
  }

  if (user.changeCredentialsTime?.getTime() > decoded.iat * 1000) {
    return next(new Error("Invalid Login credentials", { cause: 401 }));
  }

  return { user, decoded };
};

export const getLoginCred = async ({ user } = {}) => {
  const jwtid = nanoid();
  const access_token = await generateToken({
    payload: { _id: user._id, isLogedin: true },
    secretKey: process.env.ACCESS_TOKEN_SIGNATURE,
    expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    options: {
      jwtid,
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    },
  });

  const refresh_token = await generateToken({
    payload: { _id: user._id, isLogedin: true },
    secretKey: process.env.REFRESH_TOKEN_SIGNATURE,
    expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    options: {
      jwtid,
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    },
  });
  return { access_token, refresh_token };
};

export const revokeToken = async ({ req } = {}) => {
  const revokToken = await DBservice.create({
    model: TokenModel,
    data: [
      {
        jti: req.decoded.jti,
        expiresIn:
          req.decoded.iat + Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
        userId: req.decoded._id,
      },
    ],
  });
  if (!revokToken) {
    return next(new Error("Failed to revoke token", { cause: 400 }));
  }
};
