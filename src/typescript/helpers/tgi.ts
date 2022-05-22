import StorageService from "../storage-service";

const { fnv64 } = window.S4TK.hashing;

/**
 * Returns true if the given string is a hex number with the given length.
 * 
 * @param hexString Hex string to validate
 * @param digits Digits to check for
 */
export function validateHexString(hexString: string, digits: number): boolean {
  const regex = new RegExp(`^([0-9A-F]{${digits}})$`, "i");
  return regex.test(hexString);
}

/**
 * Hashes the given string as a 14-digit hex code.
 * 
 * @param value String value to hash
 */
export function hashInstanceBase(value: string, useCreatorName = true): bigint {
  let toHash = value;
  if (useCreatorName)
    toHash = StorageService.settings.creatorName + ":" + value;
  return fnv64(toHash) & 0xffffffffffffffn
}
