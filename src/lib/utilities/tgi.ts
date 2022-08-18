/**
 * Returns true if the given string is a hex number with the given length.
 * 
 * @param hexString Hex string to validate
 * @param digits Digits to check for
 */
export function validateHexString(hexString: string, digits: number): boolean {
  const regex = new RegExp(`^(0x|0X)?([0-9A-F]{${digits}})$`, "i");
  return regex.test(hexString);
}
