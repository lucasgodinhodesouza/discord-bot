const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { MODERATION } = require("../util/enum/Category");

class ShowCases extends Command {
  constructor(client) {
    super(client, {
      name: "showcases",
      description: "Shows all cases of this guild.",
      category: MODERATION,
      usage: "showcases",
      aliases: ["show-cases", "cases"],
      permLevel: ["ADMINISTRATOR"],
      requireArgs: false,
      guildOnly: true
    });
  }

  async run(message, Embed) {
    const cases = message.guild.getCases();
    if (!cases) return message.send("No cases found in this guild.");
    message.channel.send("```" + cases + "```");
  }
}

module.exports = ShowCases;