export const BCRYPT_WORK_FACTOR = 12;
export const BCRYPT_MAX_LENGTH = 64;
export const BCRYPT_MIN_LENGTH = 8;
export const BCRYPT_MIN_LENGTH_STRICT = 13;
export const EMAIL_VERIFY_INTERVAL = 3600000; // 1 hour in ms
export const PASSWORD_CHANGE_VERIFY_INTERVAL = 600000; // 10 min in ms
export const EMAIL_CHANGE_INTERVAL = 900; // 15 minutes after login

/**
 *  Pattern for atleast one uppercase, one lowercase and one digit
 */
export const passwordRegex = new RegExp(
  /^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u
);
