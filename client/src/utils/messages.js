import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const encryptMessage = (message) => {
  const encryptedMessage = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
  return encryptedMessage;
};

export const decryptMessage = (encryptedMessage) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
};
