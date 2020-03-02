const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { MODERATION } = require("../util/enum/Category");
const moment = require("moment");

class Unmute extends Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      description: "Unmutes a member.",
      category: MODERATION,
      usage: "unmute <member>",
      permLevel: ["ADMINISTRATOR"],
      requireArgs: true,
      guildOnly: true,
      commandArgs: ["member", "reason"]
    });
  }

  async run(message, Embed) {
    let logs = message.guild.findChannel("mod-log");
    if (!logs)
      logs = await message.guild.channels.create("mod-log", {
        type: "text",
        permissionOverwrites: [{ id: message.guild.id, deny: ["VIEW_CHANNEL"] }]
      });
    const member = await message.getMember();
    const unmute = member.unmute();
    if (!unmute) return message.send("The member is not muted.");
    message.send(`:white_check_mark: Unmuted **${member.user.tag}**.`);
    const embed = new Embed()
      .title(`You've been umuted in **${message.guild.name}**`)
      .field("Moderator", message.author.tag)
      .field("Reason", message.commandArgs[1])
      .field("Date", moment(Date.now(), "unix").format("L"));
    const modEmbed = new Embed()
      .title("Action: Unmute")
      .field("Moderator", message.author.tag)
      .field("Reason", message.commandArgs[1])
      .field("Date", moment(Date.now(), "unix").format("L"));
    logs.send(modEmbed);
    member.send(embed).catch(() => null);
  }
}

module.exports = Unmute;
