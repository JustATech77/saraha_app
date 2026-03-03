import jwt from "jsonwebtoken";
import { roleenum, UserModel } from "../../config/models/user.model.js";
import * as DBservice from "../../config/db.service.js";
export const sigEnum = { bearer: "Bearer", system: "System" };
export const tokenTypeEnum = { access: "access", refresh: "refresh" };

export const generateToken = async ({
  payload,
  secretKey = process.env.ACCESS_TOKEN_USER_SIGNATURE,
  expiresIn = Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
} = {}) => {
  return jwt.sign(payload, secretKey, {
    expiresIn: expiresIn,
  });
};

export const refreshToken = async ({
  payload,
  secretKey = process.env.REFRESH_TOKEN_USER_SIGNATURE,
  expiresIn = Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
} = {}) => {
  return jwt.sign(payload, secretKey, {
    expiresIn: expiresIn,
  });
};

export const verifyToken = async ({
  token,
  secretKey = process.env.ACCESS_TOKEN_USER_SIGNATURE,
} = {}) => {
  return jwt.verify(token, secretKey);
};

export const getSignature = async ({ sigLevel = sigEnum.bearer } = {}) => {
  let signtures = {
    access_token_signature: undefined,
    refresh_token_signature: undefined,
  };
  switch (sigLevel) {
    case sigEnum.system:
      signtures.access_token_signature =
        process.env.ACCESS_TOKEN_SYSTEM_SIGNATURE;
      signtures.refresh_token_signature =
        process.env.REFRESH_TOKEN_SYSTEM_SIGNATURE;
      break;

    default:
      signtures.access_token_signature =
        process.env.ACCESS_TOKEN_USER_SIGNATURE;
      signtures.refresh_token_signature =
        process.env.REFRESH_TOKEN_USER_SIGNATURE;
      break;
  }
  return signtures;
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

  const signtures = await getSignature({ sigLevel: bearer });

  const decoded = await verifyToken({
    token: token,
    secretKey:
      tokenType === tokenTypeEnum.access
        ? signtures.access_token_signature
        : signtures.refresh_token_signature,
  });
  if (!decoded) {
    return next(new Error("In-valid token", { cause: 401 }));
  }

  if (!decoded?._id) {
    return next(new Error("In-valid token payload", { cause: 401 }));
  }
  const user = await DBservice.findById({
    model: UserModel,
    id: decoded._id,
    select: "-password",
  });
  if (!user) {
    return next(new Error("Not registered user", { cause: 404 }));
  }
  return user;
};

export const getLoginCred = async ({ user } = {}) => {
  const checkRole = user.role != roleenum.admin ? "Bearer" : "System";
  const signtures = await getSignature({ sigLevel: checkRole });

  const access_token = await generateToken({
    payload: {
      _id: user._id,
      isLogedin: true,
    },
    secretKey: signtures.access_token_signature,
    expiresIn: 60 * 60,
  });
  const refresh_token = await refreshToken({
    payload: {
      _id: user._id,
      isLogedin: true,
    },
    secretKey: signtures.refresh_token_signature,
    expiresIn: "1y",
  });
  return { access_token, refresh_token };
};
