import { v4 as uuidv4 } from "uuid";

/**
 * Returns a random UUID salted with the current epoch time.
 */
export default function saltedUuid(): string {
  //@ts-ignore Date can be treated as a number in this context
  return `${Math.floor(new Date())}-${uuidv4()}`;
}
