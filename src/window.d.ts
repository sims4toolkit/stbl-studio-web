import type * as compression from "@s4tk/compression";
import type * as encoding from "@s4tk/encoding";
import type * as hashing from "@s4tk/hashing";
import type * as formatting from "@s4tk/hashing/formatting";
import type * as models from "@s4tk/models";
import type * as enums from "@s4tk/models/enums";

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
