const models = require("@s4tk/models");
const enums = require("@s4tk/models/enums");
const encoding = require("@s4tk/encoding");
const compression = require("@s4tk/compression");
const hashing = require("@s4tk/hashing");
const formatting = require("@s4tk/hashing/formatting");
const { Buffer } = require("buffer");

window.S4TK = {
  models,
  enums,
  encoding,
  compression,
  hashing,
  formatting,
  Node: {
    Buffer
  }
};
