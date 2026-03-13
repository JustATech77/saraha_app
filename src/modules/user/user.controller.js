import { Router } from "express";
import * as validators from "./user.validation.js";
import * as userService from "./user.service.js";
import * as autMiddleware from "../../middleware/authentication.js";
import { tokenTypeEnum } from "../../utils/security/token.js";
import { endPoint } from "./user.authorization.js";
import { validation } from "../../middleware/validation.js";

const userRouter = Router();

userRouter.get(
  "/profile",
  autMiddleware.auth({ accessRoles: endPoint.profile }),
  userService.profile,
);
userRouter.post(
  "/logout",
  autMiddleware.auth({
    accessRoles: endPoint.profile,
  }),
  // validation(validators.logout),
  userService.logout,
);

userRouter.get(
  "/refresh-token",
  autMiddleware.authentication({ tokenType: tokenTypeEnum.refresh }),
  userService.getNewLoginCred,
);

userRouter.get(
  "/:userId",
  validation(validators.shareProfile),
  userService.shareProfile,
);

userRouter.patch(
  "/update-basic",
  autMiddleware.auth({
    accessRoles: endPoint.profile,
  }),
  validation(validators.updateBasicInfo),
  userService.updateBasicInfo,
);

userRouter.delete(
  "{/:userId}/frezz-account",
  validation(validators.frezzAccount),
  autMiddleware.authentication(),
  userService.frezzAccount,
);

userRouter.patch(
  "/:userId/restore-account",
  validation(validators.restoreAccount),
  autMiddleware.auth({ accessRoles: endPoint.restoreAccount }),
  userService.restoreAccount,
);

userRouter.delete(
  "/:userId",
  validation(validators.deleteAccount),
  autMiddleware.auth({ accessRoles: endPoint.deleteAccount }),
  userService.deleteAccount,
);

userRouter.patch(
  "/update-password",
  autMiddleware.authentication(),
  validation(validators.updatePassword),
  userService.updatePassword,
);

export default userRouter;
