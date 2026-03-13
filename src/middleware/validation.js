import Joi from "joi";
import { Types } from "mongoose";
import { asyncHandler } from "../utils/response/response.js";
import { logoutEnum } from "../utils/security/token.js";

export const generalFields = {
  fullName: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: ["com", "net", "org", "io", "sa"],
    }),
  password: Joi.string().pattern(
    new RegExp(
      /^(?=.)(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ),
  ),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
  phone: Joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
  gender: Joi.string().valid("male", "female").default(null),
  otp: Joi.string().pattern(new RegExp(/^\d{6}$/)),
  lang: Joi.string().valid("ar", "en"),
  flag: Joi.string()
    .valid(...Object.values(logoutEnum))
    .default(logoutEnum.stayLoggedIn),
  userId: Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.message("invalid mongoose id");
    }
    return value;
  }),
};

export const validation = (schema) => {
  return asyncHandler(async (req, res, next) => {
    const validationError = [];

    for (const key of Object.keys(schema)) {
      const validateDataResult = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (validateDataResult.error) {
        validationError.push({
          key,
          details: validateDataResult.error.details,
        });
      }
    }

    if (validationError.length) {
      return res.status(400).json({
        message: "Validation Error",
        errors: validationError,
      });
    }

    return next();
  });
};
