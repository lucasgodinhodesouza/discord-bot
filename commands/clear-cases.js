const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { MODERATION } = require("../util/enum/Category");

class ClearCases extends Command {
  constructor(client) {
    super(client, {
      name: "clearcases",
      description: "Clear all cases of this guild.",
      category: MODERATION,
      usage: "clearcases",
      aliases: ["clear-cases"],
      permLevel: ["ADMINISTRATOR"],
      requireArgs: false,
      guildOnly: true
    });
  }

  async run(message, Embed) {
    const cases = message.guild.clearCases();
    if (!cases) return message.send("No cases found in this guild.");
    message.send(":white_check_mark: Cleared all cases of this guild.");
  }
}

module.exports = ClearCases;