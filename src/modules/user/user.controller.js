import { Router } from "express";
import * as validators from "./user.validation.js";
import * as userService from "./user.service.js";
import * as autMiddleware from "../../middleware/authentication.js";
import { tokenTypeEnum } from "../../utils/security/token.js";
import { endPoint } from "./user.authorization.js";
import { auth } from "google-auth-library";
import { validation } from "../../middleware/validation.js";

const userRouter = Router();

userRouter.get(
  "/profile",
  autMiddleware.auth({
    tokenType: tokenTypeEnum.access,
    accessRoles: endPoint.profile,
  }),
  userService.profile,
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
export default userRouter;
