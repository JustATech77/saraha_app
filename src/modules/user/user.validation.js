import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
import { fileValidation } from "../../utils/multer/local.multer.js";

export const shareProfile = {
  params: joi.object().keys({
    userId: generalFields.userId.required(),
  }),
};

export const updateBasicInfo = {
  body: joi
    .object()
    .keys({
      firstName: generalFields.firstName,
      lastName: generalFields.lastName,
      phone: generalFields.phone,
      gender: generalFields.gender,
    })
    .required(),
};

export const frezzAccount = {
  params: joi.object().keys({
    userId: generalFields.userId,
  }),
};

export const restoreAccount = {
  params: joi.object().keys({
    userId: generalFields.userId.required(),
  }),
};

export const deleteAccount = {
  params: joi.object().keys({
    userId: generalFields.userId.required(),
  }),
};

export const updatePassword = {
  body: joi.object().keys({
    oldPassword: generalFields.password.required(),
    newPassword: generalFields.password.not(joi.ref("oldPassword")).required(),
    confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
    flag: generalFields.flag,
  }),
};

export const logout = {
  body: joi.object().keys({
    flag: generalFields.flag,
  }),
};
export const updateProfileImage = {
  file: generalFields.file.required(),
};

export const updateCoverImage = {
  files: joi.array().items(generalFields.file).min(1).max(3).required(),
};
