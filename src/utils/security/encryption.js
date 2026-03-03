import CryptoJS from "crypto-js";

export const encrypt = async ({ plainText = "", secretKey = process.env.SECRET_KEY } = {}) => {
  return CryptoJS.AES.encrypt(plainText, secretKey).toString();
};

export const decrypt = async ({
  enctyptedTxt = "",
  secretKey = process.env.SECRET_KEY,
} = {}) => {
  return CryptoJS.AES.decrypt(enctyptedTxt, secretKey).toString(
    CryptoJS.enc.Utf8,
  );
};
