const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { MODERATION } = require("../util/enum/Category");

class GetCases extends Command {
  constructor(client) {
    super(client, {
      name: "getcases",
      description: "Get all cases of a member.",
      category: MODERATION,
      usage: "getcases <member>",
      aliases: ["get-cases"],
      permLevel: ["ADMINISTRATOR"],
      commandArgs: ["member"],
      requireArgs: true,
      guildOnly: true
    });
  }

  async run(message, Embed) {
    const member = await message.getMember();
    if (!member) return message.send("Invalid member.");
    let cases = member.getCases();
    if (cases === undefined) return message.send("No cases found for this member.");
    if (cases[0] === "hastebinned") return message.send(`Cases: ${cases[1]}`);
    message.send("```" + cases[0] + "```");
  }
}
module.exports = GetCases;
