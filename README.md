# Simple Discord.js Bot

> **A simple, little advanced, and cool Discord bot with a cool command-handler.**

## Getting Started

_First of all, holy fucking shit don't just use discord.js without having a good knowledge of JavaScript. We really recommend you to learn the main programming language before moving to create projects such as creating Discord bots or anything._

## Install

```
npm install
```

## Usage

Fill out the values in `config.js`:

```
defaultPrefix = "YOUR DEFAULT PREFIX TILL A CUSTOM IS SET."
TOKEN = "Your bot located in the environment variable, (.env)."
```

## Usage of the command-handler

Well the command handler is pretty advanced for beginners, we've done a lot of bigbrain shit there. So lets explain how we actually pass the options to the super-constructor:

```js
super(client, {
      name: "ping", // The name of the command.
      description: "Get the bot's ping", // The description of the command.
      catgeory: BASIC, // The category of the command
      usage: "ping", // The usage of the command.
      aliases: ["pang", "peng", "pong", "pung", "pyng"], // The aliases of the command.
      permLevel: [], // The permission level of the command. They should be stated as default of Discord API. Have a look here: https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
      requireArgs: false, // If any arguments are required for this command, should be passed as a boolean.
      guildOnly: true, // If this command is guild-only, should be passed as a boolean.
      commandArgs: [], // This actually means what are required for this command, the things needed.
      cooldown: "1m" // This means the cooldown of the command. s = seconds, m = minutes, h = hours, d = days.
    });
  }
```

**Notes:**

- **Do not use commandArgs for mentions, Message#getMembers() and Message#getMember() exist for that. See an example commands/kick.js**
- **Command arguments should be splitted by | in order to use the argument-handler provided in this command-handler.**

## Documentation

Look at the [Discord.js Documentation](https://discord.js.org/#/docs/main/stable/general/welcome) for its documentation. Also, join [Discord.js Official Discord server](https://discord.gg/bRCvFy9) for help related to it.

## Contributing

1. [Fork the repository](https://github.com/Extroonie/discord-bot/fork)!
2. Clone your fork: `git clone https://github.com/your-username/project-name`
3. Create your feature branch: `git checkout -b my-new-feature`
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request :D

## Developers

**Extroonie (Ishmaam Khan) and Zytekaron (Michael Thornes)**

## Author

© [Extroonie](https://github.com/Extroonie).  
Authored and maintained by Extroonie (Ishmaam Khan).

> GitHub [@Extroonie](https://github.com/Extroonie)
