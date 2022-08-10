import type compression from "@s4tk/compression";
import type encoding from "@s4tk/encoding";
import type hashing from "@s4tk/hashing";
import type formatting from "@s4tk/hashing/formatting";
import type models from "@s4tk/models";
import type enums from "@s4tk/models/enums";

declare global {
  interface Window {
    S4TK: {
      compression: typeof compression;
      encoding: typeof encoding;
      enums: typeof enums;
      formatting: typeof formatting;
      hashing: typeof hashing;
      models: typeof models;
      Node: {
        Buffer: typeof Buffer;
      };
    };
  }
}
