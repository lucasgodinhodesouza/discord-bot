const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { MODERATION } = require("../util/enum/Category");

class Warn extends Command {
  constructor(client) {
    super(client, {
      name: "warn",
      description: "Warns a member.",
      category: MODERATION,
      usage: "warn <member> <reason>",
      aliases: ["wurn"],
      permLevel: ["ADMINISTRATOR"],
      requireArgs: true,
      guildOnly: true,
      commandArgs: ["member", "reason"]
    });
  }

  async run(message, Embed) {
    const logs = message.guild.findChannel("mod-log");
    const { commandArgs } = message;
    message.getMembers((member, mod = true) => {
      const { mod: mod_, reason, date, caseNum } = member.warn(
        commandArgs[1],
        message.author.tag
      );
      const embed = new Embed()
        .title(`You've been warned in **${message.guild.name}**`)
        .field("Moderator", mod_)
        .field("Reason", reason)
        .field("Date", date);
      const modEmbed = new Embed()
        .title("Action: Warn")
        .field("Moderator", mod_)
        .field("Member", member.user.tag)
        .field("Reason", reason)
        .field("Case", caseNum)
        .field("Date", date);
      member.send(embed).catch(() => null);
      logs.send(modEmbed);
      message.send(
        `:white_check_mark: **${member.user.tag}** was warned for **${reason}**.`
      );
    });
  }
}

module.exports = Warn;