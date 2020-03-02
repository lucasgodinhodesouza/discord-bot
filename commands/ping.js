const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { BASIC } = require("../util/enum/Category");

class Ping extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Get the bot's ping",
      category: BASIC,
      usage: "ping",
      aliases: ["pang", "peng", "pong", "pung", "pyng"],
      permLevel: [],
      requireArgs: false,
      guildOnly: true,
      commandArgs: [],
      cooldown: "1m"
    });
  }

  async run(message, Embed) {
    const embed = new Embed()
      .title("Pong!")
      .field("API Latency", Math.round(this.client.ws.ping) + "ms")
      .field("Ping", "Calculating...")
      .color()
    const sent = await message.send(embed);

    const edited = new Embed()
      .title("Pong!")
      .field("API Latency", Math.round(this.client.ws.ping) + "ms")
      .field("Ping", sent.createdTimestamp - message.createdTimestamp + "ms")
      .color()
    return sent.edit(edited);
  }
}

module.exports = Ping;
