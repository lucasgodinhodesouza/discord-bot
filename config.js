require("dotenv");
const { prefixdb } = require("./db");
const defaultPrefix = "t!"; // The default prefix.
module.exports = {
  TOKEN: process.env.TOKEN,
  PREFIX: guild => {
    const exists = prefixdb.get(guild);
    if (!exists) return defaultPrefix;
    return exists.prefix;
  }
};