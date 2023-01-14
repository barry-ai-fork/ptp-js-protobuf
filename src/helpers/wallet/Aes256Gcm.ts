const { Buffer } = require('buffer');
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const BLOCK_SIZE_BYTES = 16; // 128 bit

export default class Aes256Gcm {
  /**
   * Encrypts text with AES 256 GCM.
   * @param {string} text - Cleartext to encode.
   * @param {Buffer} secret - Shared secret key, must be 32 bytes.
   * @returns {object}
   */
  static encrypt(text: string, secret: Buffer) {
    const iv = crypto.randomBytes(BLOCK_SIZE_BYTES);
    const aad = crypto.randomBytes(BLOCK_SIZE_BYTES);
    const cipher = crypto.createCipheriv(ALGORITHM, secret, iv);
    cipher.setAAD(aad);
    let ciphertext = cipher.update(text, 'utf8', 'binary');
    ciphertext += cipher.final('binary');
    return Buffer.concat([
      iv,
      Buffer.from(cipher.getAuthTag()),
      aad,
      Buffer.from(ciphertext, 'binary'),
    ]);
  }

  /**
   * Decrypts AES 256 CGM encrypted text.
   * @param {Buffer} ciphertext - Base64-encoded ciphertext.
   * @param {Buffer} iv - The base64-encoded initialization vector.
   * @param {Buffer} aad - Additional Authenticated Data.
   * @param {Buffer} tag - The base64-encoded authentication tag generated by getAuthTag().
   * @param {Buffer} secret - Shared secret key, must be 32 bytes.
   * @returns {Buffer}
   */
  static decrypt(
    ciphertext: Buffer,
    iv: Buffer,
    aad: Buffer,
    secret: Uint8Array,
    tag: Buffer
  ) {
    const decipher = crypto.createDecipheriv(ALGORITHM, secret, iv);
    decipher.setAAD(aad);
    decipher.setAuthTag(tag);
    let cleartext = decipher.update(
      ciphertext.toString('binary'),
      'binary',
      'utf8'
    );
    cleartext += decipher.final();

    return cleartext;
  }
}
