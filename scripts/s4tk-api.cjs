const models = require("@s4tk/models");
const enums = require("@s4tk/models/enums");
const hashing = require("@s4tk/hashing");
const formatting = require("@s4tk/hashing/formatting");
const { Buffer } = require("buffer");
const { unzipSync, deflateSync } = require("browserify-zlib");

window.S4TK = {
  models,
  enums,
  hashing,
  formatting,
  Node: {
    Buffer,
    unzipSync,
    deflateSync
  }
};
