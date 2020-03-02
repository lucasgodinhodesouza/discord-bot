const fs = require("fs");
const { TOKEN } = require("./config");
const functions = require("./util/functions");
const Color = require("./util/enum/Color");
require("./lib/structures/Message");
require("./lib/structures/Guild");
require("./lib/structures/GuildMember");
const Err = require("./lib/structures/CustomError");

const { Collection } = require("discord.js");
const client = require("./Client");
Object.assign(client, functions, {
  commands: new Collection(),
  mappings: new Collection()
});

process.on("unhandledRejection", err => console.error(err.stack));

fs.readdir("events/", (err, files) => {
  if (err) throw err;
  for (const fname of files) {
    const Event = require("./events/" + fname);
    const { run } = new Event();
    client.addListener(fname.split(".")[0], run.bind({ client }));
  }
});

fs.readdir("commands/", (err, files) => {
  if (err) throw new Err(err);
  for (const fname of files) {
    const Command = require("./commands/" + fname);
    const command = new Command(client);
    const { name, aliases } = command.settings;
    client.commands.set(name, command);
    for (const alias of aliases) client.mappings.set(alias, name);
  }
});

client.login(TOKEN);