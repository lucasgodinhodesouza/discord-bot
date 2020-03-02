const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { MODERATION } = require("../util/enum/Category");
const { mod: mod_ } = require("../db");

class Kick extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      description: "Kicks a member from this server.",
      category: MODERATION,
      usage: "kick <member>",
      aliases: [],
      permLevel: ["ADMINISTRATOR"],
      requireArgs: true,
      guildOnly: true,
      commandArgs: ["member", "reason"]
    });
  }

  async run(message, Embed) {
    const logs = message.guild.findChannel("mod-log");
    const { commandArgs } = message;
    const valids = [],
      invalids = [];
    await message.getMembers(async (member, mod = true) => {
      try {
        const member_ = await member.kick(commandArgs[1], message.author.tag);
        const { reason, caseNum, mod, date } = member.caseData;
        const embed = new Embed()
          .title(`You've been kicked from **${message.guild.name}**!`)
          .field("Moderator", mod)
          .field("Reason", reason)
          .field("Date", date);
        const modEmbed = new Embed()
          .title("Action: Kick")
          .field("Moderator", mod)
          .field("Member", member_.user.tag)
          .field("Reason", reason)
          .field("Case", caseNum)
          .field("Date", date);
        member_.send(embed).catch(() => null);
        logs.send(modEmbed);
        return valids.push(member_.user.tag);
      } catch (e) {
        console.error(e);
        member.clearCase(member.caseData.caseNum);
        console.log(mod);
        mod_.dec(message.guild.id, "totalCases");
        invalids.push(member.user.tag);
      }
    });

    if (valids.length) {
      const emb = new Embed().succesFor(
        `Successfully kicked **${valids.join(", ")}**`
      );
      message.send(emb);
    }
    if (invalids.length) {
      const emb_ = new Embed().errorFor(
        `Wasn't able to kick **${invalids.join(
          ", "
        )}** for some unconscious error.`
      );
      message.send(emb_);
    }
  }
}

module.exports = Kick;
