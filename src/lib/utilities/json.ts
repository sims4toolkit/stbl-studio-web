/**
 * NOTE: This is different from the global StringTableJson type, which is used
 * internally. This is meant to be more flexible, as it handles user input.
 */
type StblJson = {
  key: string | number;
  value?: string;
  string?: string;
}[];

/**
 * Parses an arbitrary JSON in a more flexible format and forces it into the
 * internal StringTableJson<number> format.
 * 
 * @param content String or Buffer content to parse as JSON STBL
 */
export function normalizeJson(content: string | Buffer): StringTableJson<number> {
  const stringContent = typeof content === "string" ? content : content.toString();
  const json: StblJson = JSON.parse(stringContent);
  return json.map((entry, i) => {
    let key: number, value: string;

    for (const prop in entry) {
      const lowerProp = prop.toLowerCase();
      if (lowerProp === "key") {
        const keyValue = entry[prop];
        if (typeof keyValue === "string") {
          key = parseInt(entry[prop], 16);
        } else if (typeof keyValue === "number") {
          key = entry[prop];
        }
      } else if (lowerProp === "value" || lowerProp === "string") {
        value = entry[prop];
      }
    }

    if (key === undefined) {
      throw new Error(`Entry at index ${i} does not have a key.`);
    } else if (key < 0 || key > 0xFFFFFFFF) {
      throw new Error(`Key of entry at index ${i} is out of bounds (${key}).`);
    }

    if (value === undefined) {
      throw new Error(`Entry at index ${i} does not have a string value.`);
    }

    return { key, value };
  });
}
