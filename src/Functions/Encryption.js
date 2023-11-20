import CryptoJS from "crypto-js";
const secretKey = "Arvel123";
const encryptArray = (arrayToEncrypt) => {
  try {
    const jsonString = JSON.stringify(arrayToEncrypt);
    const encrypted = CryptoJS.AES.encrypt(
      arrayToEncrypt,
      secretKey
    ).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

const decryptArray = (encryptedString) => {
  try {
    //console.log(encryptedString);
    const bytes = CryptoJS.AES.decrypt(encryptedString, secretKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedString;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

export { encryptArray, decryptArray };
