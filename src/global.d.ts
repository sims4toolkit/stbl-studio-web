/// <reference types="svelte" />

/**
 * Formats for downloaded files to be in.
 */
type FileDownloadType = "package" | "stbl" | "json";

/**
 * How downloaded files can be named.
 */
type FileNamingConvention = "s4s" | "s4pi" | "project";

/**
 * A JSON representation of a single-locale string table.
 */
type StringTableJson<KeyType extends number | string = number | string> = {
  key: KeyType;
  value: string;
}[];
