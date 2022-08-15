import type { StringTableResource } from "@s4tk/models";
import { validateHexString } from "./tgi";
const { models } = window.S4TK;

type StblJson = {
  key: string | number;
  value?: string;
  string?: string;
}[];

/**
 * Parses JSON content as a STBL.
 * 
 * @param content String or Buffer content to parse as JSON STBL
 */
export function parseStblJson(content: string | Buffer): StringTableResource {
  const stringContent = typeof content === "string" ? content : content.toString();
  const json: StblJson = JSON.parse(stringContent);
  return new models.StringTableResource(json.map((entry) => {
    const key = typeof entry.key === "number"
      ? entry.key
      : (validateHexString(entry.key, 8) ? parseInt(entry.key, 16) : null);

    if (key == null || key > 0xFFFFFFFF)
      throw new Error(`Key "${entry.key}" could not be parsed as a 32-bit number.`);

    //@ts-ignore
    const value = (entry.value ?? entry.string ?? "").replaceAll("\n", "\\n");

    return { key, value };
  }));
}