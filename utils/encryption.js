import CryptoJS from 'crypto-js';

function deriveKeyAndIv(keyText, ivText) {
  const secretKey = CryptoJS.SHA256(keyText).toString(CryptoJS.enc.Hex);
  const iv = CryptoJS.MD5(ivText).toString(CryptoJS.enc.Hex);
  return { secretKey: CryptoJS.enc.Hex.parse(secretKey), iv: CryptoJS.enc.Hex.parse(iv) };
}

const { secretKey, iv } = deriveKeyAndIv('*3qx^jqo8*lk#-z*806l5$(goq#1fve31xlsp7q(xj', 'anotherIV-16bytes');

export function encryptData(data) {
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), secretKey, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  return encodeURIComponent(encrypted.toString());
}

export function decryptData(ciphertext) {
  const decrypted = CryptoJS.AES.decrypt(decodeURIComponent(ciphertext), secretKey, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  return CryptoJS.enc.Utf8.stringify(decrypted);
}