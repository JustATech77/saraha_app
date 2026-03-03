import * as DBservice from "../../config/db.service.js";

import { providerenum, UserModel } from "../../config/models/user.model.js";
import {
  asyncHandler,
  successResponse,
} from "../../utils/response/response.js";
import { compareHash, generateHash } from "../../utils/security/hash.js";
import { encrypt } from "../../utils/security/encryption.js";
import { getLoginCred } from "../../utils/security/token.js";
import { OAuth2Client } from "google-auth-library";
import { emailEvent } from "../../utils/events/email.event.js";
import { customAlphabet } from "nanoid";

export const signup = asyncHandler(async (req, res, next) => {
  
  // extract data from request body
  const { fullName, email, password,confirmPassword, gender, phone } = req.body;
  // split full name into first name and last name

  // check if email already exists
  if (await DBservice.findOne({ model: UserModel, filter: { email } })) {
    return next(new Error("Email Already Exist", { cause: 409 }));
  }
  // generate hash password using bcrypt
  const hashesPass = await generateHash({ plainText: password, saltRound: 12 });

  // encrypt phone
  const encPhone = await encrypt({
    plainText: phone,
    secretKey: "SRAHA_APP_PHONE",
  });
  // generate confirm email otp using nanoid
  const otp = customAlphabet("0123456789", 6)();
  //
  const confirmEmailOtp = await generateHash({ plainText: otp, saltRound: 12 });
  // create new user
  const newUser = await DBservice.create({
    model: UserModel,
    data: [
      {
        fullName,
        email,
        password: hashesPass,
        gender,
        phone: encPhone,
        confirmEmailOtp,
      },
    ],
  });
  // send confirm email event
  emailEvent.emit("confirmEmail", {
    to: email,
    subject: "Confirm Email",
    otp: otp,
  });
  // return response
  return successResponse({
    res,
    message: "User Created Successfully",
    data: newUser,
    status: 201,
  });
});

export const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await DBservice.findOne({
    model: UserModel,
    filter: { email, provider: providerenum.system },
  });

  if (!user) {
    return next(new Error("Invalid Email or Password", { cause: 404 }));
  }

  const matchPass = await compareHash({
    plainText: password,
    hashedPassword: user.password,
  });
  if (!user.confirmEmail) {
    return next(new Error("Email Not Confirmed", { cause: 400 }));
  }
  if (!matchPass) {
    return next(new Error("Invalid Email or Password", { cause: 404 }));
  }

  const credntials = await getLoginCred({ user: user });
  return successResponse({
    res,
    message: "Login Successfully",
    data: { credntials },
  });
});

async function verifyGoogleAccount({ idToken } = {}) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

export const signupWithgmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const { picture, name, email, email_verified } = await verifyGoogleAccount({
    idToken,
  });
  if (!email_verified) {
    return next(new Error("not verified account", { cause: 400 }));
  }
  const user = await DBservice.findOne({ model: UserModel, filter: { email } });
  if (user) {
    if (user.provider === providerenum.google) {
      return siginpWithgmail(req, res, next);
    }
  }

  const [newUser] = await DBservice.create({
    model: UserModel,
    data: [
      {
        fullName: name,
        email,
        picture,
        confirmEmail: email_verified,
        provider: providerenum.google,
      },
    ],
  });
  const credntials = await getLoginCred({ user: newUser });
  return successResponse({
    res,
    message: "User Created Successfully",
    data: credntials,
    status: 201,
  });
});

export const signinWithgmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const { email, email_verified } = await verifyGoogleAccount({
    idToken,
  });
  if (!email_verified) {
    return next(new Error("not verified account", { cause: 400 }));
  }
  const user = await DBservice.findOne({
    model: UserModel,
    filter: { email, provider: providerenum.google },
  });
  if (!user) {
    return next(new Error("User Not Found", { cause: 404 }));
  }
  const credntials = await getLoginCred({ user: user });
  return successResponse({
    res,
    message: "Login Successfully",
    data: { credntials },
  });
});

export const confirmEmailOTP = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await DBservice.findOne({
    model: UserModel,
    filter: {
      email,
      confirmEmail: false,
      confirmEmailOtp: { $exists: true },
    },
  });

  if (!user) {
    return next(new Error("In-valid Account"));
  }
  if (
    !(await compareHash({
      plainText: otp,
      hashedPassword: user.confirmEmailOtp,
    }))
  ) {
    return next(new Error("In-valid OTP"));
  }

  const updatedUser = await DBservice.updateOne({
    model: UserModel,
    filter: { email },
    data: {
      confirmEmail: true,
      $unset: { confirmEmailOtp: true },
      $inc: { __v: 1 },
    },
  });
  if (!updatedUser) {
    return next(new Error("Failed to confirm email"));
  }
  return successResponse({
    res,
    message: "Email Confirmed Successfully",
    data: updatedUser,
  });
});
