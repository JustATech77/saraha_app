import * as valdators from "./auth.validation.js";
import * as authService from "./auth.service.js";
import { Router } from "express";
import { validation } from "../../middleware/validation.js";

const authRouter = Router();

authRouter.post("/signup", validation(valdators.signup), authService.signup);
authRouter.post("/signin", validation(valdators.signin), authService.signin);
authRouter.post("/signup/gmail",validation(valdators.siginpWithgmail), authService.signupWithgmail);
authRouter.post("/signin/gmail",validation(valdators.siginpWithgmail), authService.signinWithgmail);

authRouter.patch("/confirm-email",validation(valdators.confirmEmail),authService.confirmEmailOTP);


export default authRouter;
