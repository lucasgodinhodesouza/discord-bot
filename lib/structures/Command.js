const Embed = require("./EmbedConstructor");
const client = require("../../Client");
const { PREFIX } = require("../../config");

class Command {
  constructor(
    client,
    {
      name = null,
      description = "No description provided.",
      category = "Uncategorised",
      usage = "No usage provided.",
      aliases = new Array(),
      requireArgs = false,
      guildOnly = false,
      permLevel = new Array(),
      commandArgs = new Array(),
      cooldown = ""
    }
  ) {
    this.client = client;
    this.settings = {
      name,
      description,
      category,
      usage,
      aliases,
      requireArgs,
      guildOnly,
      permLevel,
      commandArgs,
      cooldown
    };
  }

  async exec(message) {
    Object.assign(this, { Embed });

    try {
      await this.run(message, Embed);
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = Command;
