import * as DBservice from "../../config/db.service.js";
import {
  providerenum,
  roleenum,
  UserModel,
} from "../../config/models/user.model.js";
import {
  asyncHandler,
  successResponse,
} from "../../utils/response/response.js";
import { decrypt, encrypt } from "../../utils/security/encryption.js";
import {
  getLoginCred,
  logoutEnum,
  revokeToken,
} from "../../utils/security/token.js";
import { compareHash, generateHash } from "../../utils/security/hash.js";

export const profile = asyncHandler(async (req, res, next) => {
  if (req.user.phone) {
    req.user.phone = await decrypt({
      enctyptedTxt: req.user.phone,
    });
  }
  return successResponse({ res, data: req.user });
});

export const logout = asyncHandler(async (req, res, next) => {
  const { flag } = req.body;
  let status = 200;
  let Resdata;
  switch (flag) {
    case logoutEnum.signOutFromAll:
      const revokTokenAll = await DBservice.updateOne({
        model: UserModel,
        filter: {
          _id: req.user._id,
        },
        data: {
          changeCredentialsTime: new Date(),
        },
      });
      break;

    case logoutEnum.signout:
      await revokeToken({ req });
      status = 201;
      break;
  }

  return successResponse({
    res,
    status,
    message: "Logout successful",
  });
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

export const updateBasicInfo = asyncHandler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = await encrypt({ plainText: req.body.phone });
  }
  const updatedUser = await DBservice.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: req.body,
  });
  if (!updatedUser) {
    return next(new Error("Failed to update user", { cause: 400 }));
  }

  return successResponse({
    res,
    message: "User updated successfully",
    data: updatedUser,
  });
});

export const frezzAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (userId && req.user.role != roleenum.admin) {
    return next(new Error("Not authorized ", { cause: 403 }));
  }
  const user = await DBservice.findOneAndUpdate({
    model: UserModel,
    filter: {
      _id: userId || req.user._id,
      deletedAt: { $exists: false },
    },

    data: {
      deletedAt: Date.now(),
      deletedBy: req.user._id,
      changeCredentialsTime: new Date(),
      $unset: {
        restoredAt: 1,
        restoredBy: 1,
      },
    },
  });

  if (!user) {
    return next(new Error("In-valied Account"));
  }
  return successResponse({ res, data: { user } });
});

export const restoreAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (req.user.role !== roleenum.admin) {
    return next(new Error("Not authorized ", { cause: 403 }));
  }
  const user = await DBservice.findOneAndUpdate({
    model: UserModel,
    filter: {
      _id: userId,
      deletedAt: { $exists: true },
    },

    data: {
      restoredAt: Date.now(),
      restoredBy: req.user._id,
      $unset: {
        changeCredentialsTime: 1,
        deletedAt: 1,
        deletedBy: 1,
      },
    },
  });

  if (!user) {
    return next(new Error("In-Valied request", { cause: 400 }));
  }
  return successResponse({
    res,
    message: "User Restored Successfully",
    data: { user },
  });
});

export const deleteAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await DBservice.deleteOne({
    model: UserModel,
    filter: {
      _id: userId,
      deletedAt: { $exists: true },
    },
  });

  if (!user.deletedCount) {
    return next(new Error("in valied user id", { cause: 400 }));
  }
  return successResponse({
    res,
    message: "User deleted successfully",
    data: { user },
  });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  if (req.user.provider !== providerenum.system) {
    return next(
      new Error("Cannot change password for non-system accounts", {
        cause: 400,
      }),
    );
  }

  const { oldPassword, newPassword, flag } = req.body;

  const isOldPasswordCorrect = await compareHash({
    plainText: oldPassword,
    hashedPassword: req.user.password,
  });

  if (!isOldPasswordCorrect) {
    return next(new Error("Old Password is incorrect", { cause: 400 }));
  }

  const hashedPassword = await generateHash({ plainText: newPassword });

  let updatedData = {};
  switch (flag) {
    case logoutEnum.signOutFromAll:
      updatedData.changeCredentialsTime = new Date();
      break;
    case logoutEnum.signout:
      await revokeToken({ req });
      break;
    case logoutEnum.stayLoggedIn:
      break;
  }

  await DBservice.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      password: hashedPassword,
      ...updatedData,
      changePasswordAt: Date.now(),
    },
  });

  return successResponse({
    res,
    message: "Password updated successfully",
  });
});
