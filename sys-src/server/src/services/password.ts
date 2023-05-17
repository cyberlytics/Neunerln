import bcrypt from 'bcrypt';
import { BCRYPT_WORK_FACTOR } from '../config/auth.config';

export class Password {
  /**
   * @param {string} password - The data to be encrypted.
   * @returns {Promise} A promise to be either resolved with the encrypted data salt or rejected with an Error
   */
  static async toHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(BCRYPT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  /**
   * @param {string} storedPassword - The data to be encrypted.
   * @param {string} suppliedPassword - The data to be compared against.
   * @returns {Promise} A promise to be either resolved with the comparison result salt or rejected with an Error
   */
  static async compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(suppliedPassword, storedPassword);
  }
}
