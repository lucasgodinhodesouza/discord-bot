const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { MODERATION } = require("../util/enum/Category");
const ms = require("ms");
const { cooldowns } = require("../db");

class Mute extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      description: "Mutes a member.",
      category: MODERATION,
      usage:
        "mute <member> 10s/h/m/d. s = seconds, m = minutes, h = hours, d = days.",
      permLevel: ["ADMINISTRATOR"],
      requireArgs: true,
      guildOnly: true,
      commandArgs: ["member", "time", "reason"]
    });
  }

  async run(message, Embed) {
    let logs = message.guild.findChannel("mod-log");
    const member = await message.getMember();
    if (!member) return message.send("Invalid member.");
    let [, time, reason] = message.commandArgs;
    const regex = /\d+[smhd]/;
    if (!time.match(regex))
      return message.send(
        `You should provide a valid time. The basic usage would be \`${this.usage}\``
      );
    time = ms(time.match(regex)[0]);
    const muted = member.mute(reason, message.author.tag);
    message.send(`:white_check_mark: Muted **${member.user.tag}**.`);
    const { mod, date, caseNum } = muted;
    const embed = new Embed()
      .title(`You've been muted in **${message.guild.name}**`)
      .field("Moderator", mod)
      .field("Reason", reason)
      .field("Date", date);
    const modEmbed = new Embed()
      .title("Action: Mute")
      .field("Moderator", mod)
      .field("Member", member.user.tag)
      .field("Reason", reason)
      .field("Case", caseNum)
      .field("Date", date);
    member.send(embed).catch(() => null);
    logs.send(modEmbed);
    const str = JSON.stringify([caseNum, Date.now() + time, message.channel.id]);
    cooldowns.set(message.guild.id + "_" + member.id, str, "muteTime");
  }
}

module.exports = Mute;
