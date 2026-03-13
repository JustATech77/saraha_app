import { asyncHandler } from "../utils/response/response.js";
import { decodeToken, tokenTypeEnum } from "../utils/security/token.js";

export const authentication = ({ tokenType = tokenTypeEnum.access } = {}) => {
  return asyncHandler(async (req, res, next) => {
    const { user, decoded } =
      (await decodeToken({
        next,
        authorization: req.headers.authorization,
        tokenType,
      })) || {};
    if (!user) {
      return;
    }
    req.user = user;
    req.decoded = decoded;
    return next();
  });
};

export const authorization = ({ accessRoles = [] } = {}) => {
  return asyncHandler(async (req, res, next) => {
    const checkAuthorization = accessRoles.includes(req.user.role);
    if (!checkAuthorization) {
      return next(new Error("Not authorized", { cause: 403 }));
    }
    return next();
  });
};

export const auth = ({
  tokenType = tokenTypeEnum.access,
  accessRoles = [],
} = {}) => {
  return asyncHandler(async (req, res, next) => {
    const { user, decoded } =
      (await decodeToken({
        next,
        authorization: req.headers.authorization,
        tokenType,
      })) || {};
    if (!user) {
      return;
    }
    req.user = user;
    req.decoded = decoded;

    const checkAuthorization = accessRoles.includes(user.role);
    if (!checkAuthorization) {
      return next(new Error("Not authorized", { cause: 403 }));
    }
    return next();
  });
};
