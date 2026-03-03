import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signup = {
  body: joi
    .object()
    .keys({
      fullName: generalFields.fullName.required(),
      email: generalFields.email.required(),
      password: generalFields.password.required(),
      confirmPassword: generalFields.confirmPassword.required(),
      phone: generalFields.phone.required(),
      gender: generalFields.gender.required(),
    })
    .required()
    .options({ allowUnknown: false }),
};

export const signin = {
  body: joi
    .object()
    .keys({
      email: generalFields.email,
      password: generalFields.password,
    })
    .required()
    .options({ allowUnknown: false }),
};

export const confirmEmail = {
  body: joi
    .object()
    .keys({
      email: generalFields.email.required(),
      otp: generalFields.otp.required(),
    })
    .required()
    .options({ allowUnknown: false }),
};

export const siginpWithgmail = {
  body: joi
    .object()
    .keys({
      idToken: joi.string().required(),
    })
    .required()
    .options({ allowUnknown: false }),
};
