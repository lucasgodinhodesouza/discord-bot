const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { UTILITY } = require("../util/enum/Category");
const { prefixdb } = require("../db");

class SetPrefix extends Command {
  constructor(client) {
    super(client, {
      name: "setprefix",
      description: "Set a custom prefix for this server.",
      category: UTILITY,
      usage: "setprefix <new pefix>",
      aliases: ["set-prefix"],
      permLevel: ["ADMINISTRATOR"],
      requireArgs: true,
      guildOnly: true,
      commandArgs: ["prefix"]
    });
  }

  async run(message, Embed) {
    const { commandArgs } = message;
    const newPrefix = commandArgs[0];
    prefixdb.set(message.guild.id, newPrefix, "prefix");
    return message.send(
      "Prefix has been set to " + prefixdb.get(message.guild.id).prefix
    );
  }
}

module.exports = SetPrefix;
