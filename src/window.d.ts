import type { CompressionType, compressBuffer, decompressBuffer } from "@s4tk/compression";
import type { BinaryEncoder, BinaryDecoder } from "@s4tk/encoding";
import type { fnv32, fnv64 } from "@s4tk/hashing";
import type { formatAsHexString, formatResourceKey, formatStringKey, formatResourceInstance } from "@s4tk/hashing/formatting";
import type { Package, StringTableResource } from "@s4tk/models";
import type { StringTableLocale, BinaryResourceType } from "@s4tk/models/enums";
import type StringEntry from "@s4tk/models/lib/resources/stbl/string-entry";

declare global {
  interface Window {
    S4TK: {
      compression: {
        CompressionType: typeof CompressionType;
        compressBuffer: typeof compressBuffer;
        decompressBuffer: typeof decompressBuffer;
      },
      encoding: {
        BinaryEncoder: typeof BinaryEncoder;
        BinaryDecoder: typeof BinaryDecoder;
      },
      enums: {
        StringTableLocale: typeof StringTableLocale;
        BinaryResourceType: typeof BinaryResourceType;
      },
      formatting: {
        formatAsHexString: typeof formatAsHexString;
        formatResourceKey: typeof formatResourceKey;
        formatStringKey: typeof formatStringKey;
        formatResourceInstance: typeof formatResourceInstance;
      },
      hashing: {
        fnv64: typeof fnv64;
        fnv32: typeof fnv32;
      },
      models: {
        Package: typeof Package;
        StringTableResource: typeof StringTableResource;
      },
      Node: {
        Buffer: typeof Buffer;
      }
    };
  }
}
