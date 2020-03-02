const {
  Structures,
  MessageEmbed,
  MessageAttachment,
  TextChannel,
  User,
  GuildMember
} = require("discord.js");
const Err = require("../../lib/structures/CustomError");
const replies = new Map();
const nul = () => null;
const regex = /\d{17,18}/g;

Structures.extend("Message", Message => {
  return class extends Message {
    constructor(...args) {
      super(...args);
    }

    /**
     * Sends a message to the channel, and also checks for editability.
     * @param {Message} message - The message that is used for its channel when sending the response.
     * @param  {...any} args - Any of the args of TextBasedChannel#send.
     * @returns {Promise<Message|Array<Message>>} What was sent.
     * @author Extroonie
     */

    async send(channel, ...args) {
      if (channel && !(channel instanceof TextChannel)) {
        args.unshift(channel);
        channel = this.channel;
      }
      channel = channel ? channel : this.channel;

      let reply = replies.get(this.id);

      if (reply) {
        if (
          reply.attachments.size ||
          args.some(
            data =>
              data instanceof MessageAttachment ||
              data.file ||
              (data.files && data.files.length)
          )
        ) {
          // We handle the attachments here, they're not editable:

          await reply.delete();
          reply = await channel.send(...args);
          replies.set(this.id, reply);
        } else if (
          args.some(
            data => data instanceof MessageEmbed || data.hasOwnProperty("embed")
          )
        ) {
          // Else if it's an embed:

          reply = await reply.edit(...args);
        } else {
          // Else if it's not an embed, a normal message, we set the embed to null:

          reply = await reply.edit(...args, { embed: null });
        }
      } else {
        // Else if the message isn't editable, doesn't exist, not in the Map, for example:

        reply = await channel.send(...args);
        replies.set(this.id, reply);
      }

      return reply;
    }

    /**
     * Sends a DM to a user/member.
     * @param {string} userOrMember - The user/member to send the DM to. If this parameter is skipped, the message will be sent to this author.
     * @param {...any} args - Any of the args of TextBasedChannel#send.
     * @returns {Promise<Message>|null} What was sent or null, if it was not successful.
     * @author Extroonie
     */

    sendDM(userOrMember, ...args) {
      if (
        userOrMember &&
        !(userOrMember instanceof User) &&
        !(userOrMember instanceof GuildMember)
      ) {
        args.unshift(userOrMember);
        userOrMember = this.author;
      }
      userOrMember = userOrMember ? userOrMember : this.author;
      return userOrMember.send(...args).catch(nul);
    }

    /**
     * Gets a member from this message. From IDs/mentions.
     * @param {boolean} mod - If this purpose is a moderation purpose, we don't want to pass the executor.
     * @returns {(GuildMember|null)} The member.
     * @author Extroonie
     */

    getMember(mod = false) {
      const id = this.content.match(regex);
      if (id.length > 1)
        throw new Err(
          "Message#getMember should only be used for only to get a member from the message. Use Message#getMembers instead for multiple."
        );
      if (id) return this.guild.members.fetch(id[0]);
      if (mod && !id) return null;
      return this.member;
    }

    /**
     * Handles doing stuff with multiple members, else the executor.
     * @param {Function} doThat - The thing to do with the member.
     * @param {boolean} mod - If this purpose is a moderation purpose, we don't want to pass the executor.
     * @returns {Array} The array of members in this message.
     * @author Extroonie
     */

    async getMembers(doThat, mod = false) {
      const botMention = new RegExp(`^(<@!?${this.client.user.id}>)`);
      let matches = this.content.replace(botMention, "").match(regex); // Lets remove the bot mention, if it had. Wouldn't work if someone mentioned the bot and doesn't want the bot to be there.
      let p_members = [];
      for (const id of matches || [this.member.id]) {
        // Here we fetch each member which were mentioned/given the ID in the message. If none, we do that with the author of message aka who executed the command.
        p_members.push(
          await this.guild.members
            .fetch(id)
            .catch(
              () => (
                this.channel.send(
                  `An error occurred whilst fetching the user by id "**${id}**"`
                ),
                false
              )
            )
        );
      }
      const executor = p_members.findIndex(i => i === this.member.id);
      if (mod) p_members.splice(executor, 1);
      p_members = await Promise.all(p_members.filter(Boolean).map(doThat)); // Do that.
      if (!p_members.length)
        return this.channel.send(
          "No members were mentioned or an ID was given."
        );
      return p_members;
    }
  };
});
