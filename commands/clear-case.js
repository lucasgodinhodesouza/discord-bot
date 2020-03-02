const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { MODERATION } = require("../util/enum/Category");

class ClearCases extends Command {
  constructor(client) {
    super(client, {
      name: "clearcase",
      description: "Clears a case of this guild.",
      category: MODERATION,
      usage: "clearcase <id>",
      aliases: ["clear-case"],
      permLevel: ["ADMINISTRATOR"],
      commandArgs: ["id"],
      requireArgs: false,
      guildOnly: true
    });
  }

  async run(message, Embed) {
    const case_ = message.guild.clearCase(message.commandArgs[0]);
    if (!case_) return message.send("Couldn't find that case!");
    message.send(":white_check_mark: The case has been cleared.");
  }
}

module.exports = ClearCases;
