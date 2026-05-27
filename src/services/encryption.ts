import CryptoJS from 'crypto-js';

// Secure key for production encryption
const ENCRYPTION_KEY = process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'athar_fallback_secure_super_secret_key_202221234';

// Deterministically derive static key (256-bit) and IV (128-bit) from key
// This guarantees pure-JS execution without calling native secure random number generators
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
      console.error('[EncryptionService] Encryption failed:', error);
      throw new Error('Encryption failed');
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
        throw new Error('Decrypted string is empty or invalid key');
      }
      return decryptedText;
    } catch (error) {
      console.error('[EncryptionService] Decryption failed:', error);
      throw new Error('Decryption failed');
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
