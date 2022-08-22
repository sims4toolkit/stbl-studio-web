/// <reference types="svelte" />

/**
 * A JSON representation of a single-locale string table.
 */
type StringTableJson<KeyType extends number | string = number | string> = {
  key: KeyType;
  value: string;
}[];
