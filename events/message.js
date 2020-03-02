const { PREFIX } = require("../config");
const Embed = require("../lib/structures/EmbedConstructor");
const ArgumentHandler = require("../lib/structures/ArgumentHandler");
const { mod, cooldowns } = require("../db");
const ms = require("ms");
const moment = require("moment");
const duration = require("../util/duration");
const ops = { months: 1, weeks: 1, days: 1, hours: 1, minutes: 1, seconds: 1 };

class MessageEvent {
  constructor(client) {
    this.client = client;
  }
  async run(message) {
    const prefix = PREFIX(message.guild.id);
    const key = message.guild.id;
    const key_ = message.guild.id + "_" + message.author.id;
    mod.ensure(key, { cases: [], totalCases: 0 });
    cooldowns.ensure(key_, { time: 0, muteTime: 0 });
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    let logs = message.guild.findChannel("mod-log");
    if (!logs) {
      logs = await message.guild.channels.create("mod-log", {
        type: "text",
        permissionOverwrites: [{ id: message.guild.id, deny: ["VIEW_CHANNEL"] }]
      });
      logs.send(
        "Do **NOT** delete this channel, this channel was created for moderation logs. This needs to be created in order to make this bot work."
      );
    }
    let role = message.guild.findRole("Muted");
    if (!role) {
      role = await message.guild.roles.create({
        data: {
          name: "Muted",
          color: "BLUE",
          reason: "Muted role needs to be created in order to mute people."
        }
      });
    }
    message.guild.channels.forEach(channel => {
      channel.overwritePermissions({
        permissionOverwrites: [
          {
            id: role,
            deny: ["SEND_MESSAGES"]
          }
        ],
        reason: "Needed to change permissions."
      });
    });
    message.args = message.content
      .slice(prefix.length)
      .trim()
      .split(" ");
    let command = message.args.shift();

    if (!message.client.commands.get(command)) {
      if (!message.client.mappings.get(command)) return;
      command = message.client.mappings.get(command);
    }
    command = message.client.commands.get(command);

    if (command.settings.cooldown) {
      const { time } = cooldowns.get(key_);
      if (time > Date.now()) {
        const m = await message.send(
          `You're in a cooldown for: ${duration.formatFromTime(
            time - Date.now(),
            "ms",
            ops
          )}`
        );
        const interval = setInterval(() => {
          m.edit(
            `You're in a cooldown for: ${duration.formatFromTime(
              time - Date.now(),
              "ms",
              ops
            )}`
          );
          if (Date.now() > time) {
            m.edit("Cooldown is over, you can use the command again!");
            clearInterval(interval);
          }
        }, 5000);
        return;
      }
      const c = Date.now() + ms(command.settings.cooldown);
      cooldowns.set(key_, c, "time");
    }

    if (command.settings.guildOnly && !message.guild) return;
    const embed = new Embed().errorFor(
      `No arguments were provided. The appropriate usage would be: \`${command.settings.usage}\``
    );
    if (command.settings.requireArgs && !message.args[0])
      return message.send(embed);
    message.commandArgs = new ArgumentHandler().exec(
      message.args,
      command.settings.commandArgs
    );
    if (
      command.settings.commandArgs.length > message.commandArgs.length &&
      command.settings.requireArgs
    ) {
      const notProvided = command.settings.commandArgs.slice(
        message.commandArgs.length
      );
      let popped = "",
        embd_;
      if (notProvided.length > 2) popped = notProvided.pop();
      if (popped)
        embd_ = new Embed().errorFor(
          `**${notProvided.join(", ")}** and **${popped}** was not provided.`
        );
      else {
        embd_ = new Embed().errorFor(
          `**${notProvided.join(", ")}** was not provided.`
        );
      }
      return message.send(embd_);
    }
    if (command.settings.permLevel.length) {
      const requiredPerms = command.settings.permLevel.map(e =>
        e
          .split("_")
          .map(t => t[0] + t.slice(1).toLowerCase())
          .join(" ")
      );
      let popped = "",
        emb_;
      if (requiredPerms.length > 2) popped = requiredPerms.pop();
      if (popped) {
        emb_ = new Embed().errorFor(
          `You don't have enough permissions to use this command. You should have **${requiredPerms.join(
            ", "
          )}** and **${popped}**.`
        );
      } else {
        emb_ = new Embed().errorFor(
          `You don't have enough permissions to use this command. You should have **${requiredPerms.join(
            ", "
          )}** permission.`
        );
      }
      const has = command.settings.permLevel.filter(perm =>
        message.member.permissions.has(perm)
      ).length;
      if (has !== command.settings.permLevel.length) {
        return message.send(emb_);
      }
    }

    command.exec(message);
  }
}

module.exports = MessageEvent;
