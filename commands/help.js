const Command = require("../lib/structures/Command");
const Color = require("../util/enum/Color");
const { UTILITY } = require("../util/enum/Category");
const {
  type,
  toUpper,
  joinif,
  joinby,
  groupArray
} = require("../util/functions");

class Help extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "Get a list of commands or more information about a command",
      category: UTILITY,
      usage: ["help [command]", "help", "help kick"],
      aliases: ["h", "halp", "hilp", "holp", "hulp", "command", "commands"],
      permLevel: [],
      requireArgs: false,
      guildOnly: true,
      commandArgs: []
    });
  }

  async run(message, Embed) {
    const { args } = message;
    let embed,
      embeds,
      command = args.join(" ");

    let em = false;
    if (!message.client.commands.get(command))
      command = message.client.mappings.get(command);
    command = message.client.commands.get(command);
    if (command) embed = this.commandEmbed(command);
    else {
      const groups = groupArray(this.client.commands.array(), 5, true);
      const { grouped, ignored } = groups;
      let pages = grouped.length;
      if (ignored.length > 2) pages = grouped.length + 1;
      embeds = grouped.map((_, i) => {
        return new Embed()
          .title(`Help (Page ${i + 1} out of ${pages})`)
          .color(Color.GREEN);
      });

      for (let i = 0; i < grouped.length; i++) {
        grouped[i].map(cmd => {
          const { name, description } = cmd.settings;
          embeds[i].field(name, joinif(description));
        });
      }
      if (ignored.length) {
        const emb = (embeds[grouped.length] = new Embed()
          .title(`Page (${pages} out of ${pages})`)
          .color(Color.GREEN));
        for (const cmd of ignored) {
          const { name, description } = cmd.settings;
          emb.field(name, joinif(description));
        }
      }
      em = true;
    }

    let sent;
    if (em) sent = embeds[0];
    else sent = embed;
    sent = await message.send(sent);

    if (em) {
      Promise.all([sent.react("▶"), sent.react("◀")]).catch(console.error);
      function createConstrainer(a, b) {
        return n => (n < a ? a : n > b ? b : n);
      }
      let page = 0;
      const constrain = createConstrainer(0, embeds.length - 1);
      const filter = (reaction, user) => {
        return (
          ["▶", "◀"].includes(reaction.emoji.name) &&
          user.id === message.author.id
        );
      };

      const collector = sent.createReactionCollector(filter, { time: 600000 });

      collector.on("collect", (reaction, user) => {
        if (user.bot) return; // No, no bot reactions.
        const { name: r } = reaction.emoji;
        if (r === "▶") {
          page++;
        }
        if (r === "◀") {
          page--;
        }
        page = constrain(page);
        sent.edit(embeds[page]);
      });

      collector.on("end", async (collected, reason) => {
        sent.reactions.removeAll();
      });
    }
  }
  commandEmbed(command) {
    let aliases = command.settings.aliases.join(", ");
    aliases = aliases ? aliases: "No aliases were provided for this command.";
    return new this.Embed()
      .title("Help -> " + toUpper(command.settings.name))
      .field("Description", joinif(command.settings.description), false)
      .field("Usage", "`" + joinby("\n", command.settings.usage) + "`", false)
      .field("Aliases", aliases)
      .field("Category", command.settings.category)
      .color()
  }
}

module.exports = Help;