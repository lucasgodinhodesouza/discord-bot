const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { MODERATION } = require("../util/enum/Category");

class ShowCase extends Command {
  constructor(client) {
    super(client, {
      name: "showcase",
      description: "Shows a case information.",
      category: MODERATION,
      usage: "showcase <id>",
      aliases: ["show-case", "case"],
      permLevel: ["ADMINISTRATOR"],
      requireArgs: true,
      guildOnly: true,
      commandArgs: ["id"]
    });
  }

  async run(message, Embed) {
    const { commandArgs } = message;
    const c = message.guild.getCase(commandArgs[0]);
    if (!c)
      return message.send("Invalid case number or the case wasn't found.");
    const { member, reason, caseNum, mod, date } = c;
    const member_ = await message.guild.members.fetch(member).catch(() => null);
    const embed = new Embed()
      .title("Case information")
      .field("Member", member_.user.tag)
      .field("Moderator", mod)
      .field("Reason", reason)
      .field("Case", caseNum)
      .field("Date", date);
    message.send(embed);
  }
}

module.exports = ShowCase;