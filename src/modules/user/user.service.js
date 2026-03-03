import * as DBservice from "../../config/db.service.js";
import { UserModel } from "../../config/models/user.model.js";
import { validation } from "../../middleware/validation.js";
import {
  asyncHandler,
  successResponse,
} from "../../utils/response/response.js";
import { decrypt } from "../../utils/security/encryption.js";
import { getLoginCred } from "../../utils/security/token.js";

export const profile = asyncHandler(async (req, res, next) => {
  if (req.user.phone) {
    req.user.phone = await decrypt({
      enctyptedTxt: req.user.phone,
      secretKey: "SRAHA_APP_PHONE",
    });
  }
  return successResponse({ res, data: req.user });
});

export const getNewLoginCred = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const credntials = await getLoginCred({ user: user });
  return successResponse({
    res,
    data: { credntials },
  });
});

export const shareProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  
  const user = await DBservice.findOne({
    model: UserModel,
    filter: {
      _id: userId,
      confirmEmail: { $exists: true },
    },
  });
  if (!user) {
    return next(new Error("In-Valied Id"));
  }
  return successResponse({
    res,
    data: user,
  });
});
