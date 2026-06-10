// خدمة التشفير وفك التشفير للتخزين المحلي الآمن
import CryptoJS from 'crypto-js';

// مفتاح التشفير الآمن - من المتغيرات البيئية أو القيمة الافتراضية
const ENCRYPTION_KEY = process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'athar_fallback_secure_super_secret_key_202221234';

// اشتقاق مفتاح و IV ثابتين 256-bit من المفتاح الرئيسي
// تنفيذ خالص بالجافاسكريبت بدون استخدام المولدات العشوائية الآمنة
const key = CryptoJS.SHA256(ENCRYPTION_KEY);
const iv = CryptoJS.MD5(ENCRYPTION_KEY);

export const EncryptionService = {
  /**
   * Encrypts a plain text string using AES-256 with derived key and IV
   */
  encrypt: (plainText: string): string => {
    try {
      const encrypted = CryptoJS.AES.encrypt(plainText, key, { iv });
      return encrypted.toString();
    } catch (error) {
      console.error('[EncryptionService] فشل التشفير:', error);
      throw new Error('فشل التشفير');
    }
  },

  /**
   * Decrypts an encrypted ciphertext back to plain text
   */
  decrypt: (cipherText: string): string => {
    try {
      const decrypted = CryptoJS.AES.decrypt(cipherText, key, { iv });
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) {
        throw new Error('النص المفكك فارغ أو المفتاح غير صالح');
      }
      return decryptedText;
    } catch (error) {
      console.error('[EncryptionService] فشل فك التشفير:', error);
      throw new Error('فشل فك التشفير');
    }
  },

  /**
   * Helper to encrypt any JS object/JSON securely
   */
  encryptData: (data: any): string => {
    return EncryptionService.encrypt(JSON.stringify(data));
  },

  /**
   * Helper to decrypt and parse an encrypted JSON string
   */
  decryptData: <T = any>(cipherText: string): T => {
    const plain = EncryptionService.decrypt(cipherText);
    return JSON.parse(plain) as T;
  }
};
