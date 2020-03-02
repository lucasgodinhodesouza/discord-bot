const Enmap = require("enmap");
const prefixdb = new Enmap({ name: "prefix" });
const mod = new Enmap({ name: "moderation" });
const cooldowns = new Enmap({ name: "cooldowns" });

module.exports = { prefixdb, mod, cooldowns };