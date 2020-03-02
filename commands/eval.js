const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const Category = require("../util/enum/Category");
const { DEVELOPER } = Category;
const { TOKEN, PREFIX } = require("../config");
const {
  type,
  hastebin,
  toUpper,
  joinIf,
  joinby,
  each,
  mapto
} = require("../util/functions");
const { inspect } = require("util");
const { PI, floor, ceil, min, max } = Math;
const {
  Collection,
  MessageAttachment,
  Guild,
  GuildMember
} = require("discord.js");
const { mod, cooldowns } = require("../db");
function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
}
const reg = new RegExp(escapeRegExp(TOKEN), "g");

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      description: "Evaluates a JavaScript code.",
      category: DEVELOPER,
      usage: "eval <code>",
      aliases: ["e", "ev"],
      permLevel: [],
      requireArgs: true,
      guildOnly: false,
      commandArgs: ["code"]
    });
  }

  async run(message, Embed) {
    const { cases } = mod.get(message.guild.id);
    const { args } = message;
    const owners = [
      "SUPER TRUSTED OWNERS WHO WILL HAVE ACCESS TO EVALUATE. DANGEROUS FOR NON-TRUSTED PEOPLE, PLEASE BEWARE!"
    ];

    if (!owners.includes(message.author.id)) {
      const em = new Embed().errorFor(
        [
          "You aren't the developer of this bot, and *you know it!* SMH MY HEAD...",
          "You __obviously__ don't have permission to use this command.",
          "Error: Couldn't find a reality in which a normal user could eval things in a good bot like myself",
          '**Input:**```\nmessage.guild.members\n.find(member => member.user.tag === "' +
            message.author.tag +
            '")\n.ban("No reason really");\n```**Result:**```\nExecuting...\n```'
        ][Math.floor(Math.random() * 4)]
      );
      message.send(em);
      return;
    }

    let ev = args.join(" ");
    if (ev.length > 1000) {
      return message.send(
        "You're going too far, boi. The message limit has been already more than 1000 characters."
      );
    }

    let silent = false;
    let hide = false;
    if (/\s-s$/.exec(ev) !== null) {
      silent = true;
      ev = ev.replace(/\s-s$/, "");
    }
    if (/\s-h$/.exec(ev) !== null) {
      hide = true;
      ev = ev.replace(/\s-h$/, "");
    }
    if (/\s-s$/.exec(ev) !== null) {
      silent = true;
      ev = ev.replace(/\s-s$/, "");
    }

    if (hide) message.delete();
    let err = false;

    let evaled = false;
    let type_output = null;
    try {
      evaled = await eval(ev);
      type_output = "```js\n" + type(evaled) + "\n```";
      if (typeof evaled !== "string") evaled = inspect(evaled);
    } catch (e) {
      evaled = e.stack;
      type_output = "```js\n" + e.name + "\n```";
      err = true;
    }

    const greater = clean(evaled).length + "``````\n\n".length > 1024;
    if (greater) {
      evaled = `[Here](${await hastebin(clean(evaled))})`;
    }
    if (evaled.includes(TOKEN)) evaled = evaled.replace(reg, "[BOT TOKEN]");

    const embed = new Embed();
    err ? embed.error() : embed.success();
    embed.field("Input", "```js\n" + ev + "```\n");
    greater
      ? embed.field("Output", evaled)
      : embed.field("Output", "```js\n" + clean(evaled) + "```\n");
    embed.field("Type", type_output);
    if (!silent) message.send(embed);

    function clean(text) {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    }
  }
}

module.exports = Eval;