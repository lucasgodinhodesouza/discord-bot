const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { MODERATION } = require("../util/enum/Category");

class Warnings extends Command {
  constructor(client) {
    super(client, {
      name: "warnings",
      description: "Shows warnings of a member.",
      category: MODERATION,
      usage: "warnings <member>",
      aliases: ["wurnings"],
      permLevel: ["ADMINISTRATOR"],
      requireArgs: true,
      guildOnly: true,
      commandArgs: ["member"]
    });
  }

  async run(message, Embed) {
    const member = await message.getMember();
    const warnings = member.getWarnings();
    if (!warnings) return message.send(`No warnings found for **${member.user.tag}**.`);
    message.send("```" + warnings + "```");
  }
}

module.exports = Warnings;