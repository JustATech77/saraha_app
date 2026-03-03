import bcrypt from "bcryptjs";

export const generateHash = async ({
  plainText = "",
  saltRound = process.env.SALT_ROUND,
} = {}) => {
  return bcrypt.hashSync(plainText, parseInt(saltRound));
};

export const compareHash = async ({
  plainText = "",
  hashedPassword = "",
} = {}) => {
  return bcrypt.compareSync(plainText, hashedPassword);
};
