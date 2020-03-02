const Embed = require("../lib/structures/EmbedConstructor");
const { cooldowns } = require("../db");
const moment = require("moment");

class ReadyEvent {
  constructor(client) {
    this.client = client;
  }
  async run() {
    console.log(
      `Logged in as: ${this.client.user.tag} (${this.client.user.id})`
    );
    this.client.user.setActivity("something");
    cooldowns.keyArray().map(async key => {
      if (!cooldowns.get(key)) return;
      const guild = this.client.guilds.get(key.split("_")[0]);
      const member = await guild.members.fetch(key.split("_")[1]);
      let logs = guild.findChannel("mod-log");
      if (!logs)
        logs = await guild.channels.create("mod-log", {
          type: "text",
          permissionOverwrites: [{ id: guild.id, deny: ["VIEW_CHANNEL"] }]
        });
      let role = guild.findChannel("Muted");
      if (!role)
        role = await guild.roles.create({
          data: {
            name: "Muted",
            color: "BLUE",
            reason: "Muted role needs to be created in order to mute people."
          }
        });
      if (!member || !member.roles.has(role.id)) return;
      setInterval(() => {
        let { muteTime: muteTime_ } = cooldowns.get(key);
        if (!muteTime_) return;
        muteTime_ = JSON.parse(muteTime_);
        console.log(muteTime_);
        const [caseNum, muteTime] = muteTime_;
        const channel = this.client.channels.get(muteTime_[2]);
        if (muteTime > Date.now()) return;
        member.unmute();
        member.roles.remove(role);
        cooldowns.set(key, 0, "muteTime");
        if (channel)
          channel.send(
            `:white_check_mark: Umuted **${member.user.tag}**, the time provided has been over.`
          );
        const embed = new Embed()
          .title(`You've been umuted in **${member.guild.name}**`)
          .field("Moderator", this.client.user.tag)
          .field("Reason", "The provided time has been over.")
          .field("Date", moment(Date.now(), "unix").format("L"));
        const modEmbed = new Embed()
          .title("Action: Unmute")
          .field("Moderator", this.client.user.tag)
          .field("Member", member.user.tag)
          .field("Reason", "The provided time has been over.")
          .field("Date", moment(Date.now(), "unix").format("L"))
          .field("Case", caseNum);
        member.send(embed).catch(() => null);
        logs.send(modEmbed);
      }, 5000);
    });
  }
}

module.exports = ReadyEvent;
