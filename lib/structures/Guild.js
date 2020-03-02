const { Structures, Channel, Role } = require("discord.js");
const regex = /\d{17,18}/g;
const Err = require("../../lib/structures/CustomError");
const { mod } = require("../../db");
const { hastebin } = require("../../util/functions");

Structures.extend("Guild", Guild => {
  return class extends Guild {
    constructor(...args) {
      super(...args);
    }

    /**
     * Finds a channel in a guild.
     * @param {string} channel - The channel name/ID to find.
     * @returns {(GuildChannel|null)} The channel, or null.
     * @author Extroonie
     */

    findChannel(channel, type) {
      if (!channel)
        throw new Err('The parameter "channel" was not passed', "Error");
      const types = ["text", "voice", "category"];
      let channel_;
      if (type) {
        if (!types.includes(type))
          throw new Err(
            'The provided "type" is not a valid channel type, please provide one of ' +
              types.join(", ")
          );
        channel_ = this.channels.cache.find(
          c => c.type === type && c.name === channel
        );
      } else channel_ = this.channels.cache.find(c => c.name === channel);
      if (regex.test(channel)) channel_ = this.channels.cache.get(channel);
      return channel_ ? channel_ : null;
    }

    /**
     * Finds a role in a guild.
     * @param {string} role - The role ID/name to find.
     * @returns {(Role|null)} The role, or null.
     * @author Extroonie
     */

    findRole(role) {
      if (!role) throw new Err('The parameter "role" was not passed', "Error");
      let role_ = this.roles.cache.find(r => r.name === role);
      if (regex.test(role)) role_ = this.roles.cache.get(role);
      return role_ ? role_ : null;
    }

    /**
     * Get a case of this guild.
     * @param {string} id - The case ID.
     */

    getCase(id) {
      const { cases } = mod.get(this.id);
      if (!id) throw new Error("No case ID was provided.", "getCaseError");
      id = Number(id);
      if (!cases.length) return undefined;
      const case_ = cases.find(({ caseNum }) => caseNum === id);
      if (!case_) return undefined;
      return case_;
    }

    /**
     * Get cases all cases of this guild.
     * @returns {string} All cases.
     */

    async getCases() {
      let { cases } = mod.get(this.id);
      if (!cases.length) return undefined;
      const arr = [];
      cases = cases
        .map(c => {
          let member = this.members.get(c.member);
          if (!member) member = c.member;
          else member = member.user.tag;
          return `Member: ${member} (${this.id})\nAction: ${c.action}\nModerator: ${c.mod}\nCase: ${c.caseNum}\nReason: ${c.reason} - ${c.date}`;
        })
        .join("\n\n");
      if (cases.length > 2000) {
        arr.push("hastebinned");
        arr.push(await hastebin(cases));
      } else cases = arr.push(cases);
      return cases;
    }

    /**
     * Clears a case of this guild.
     * @param {string} id - The ID of the case.
     * @returns {object} - The removed case-object.
     */

    clearCase(id) {
      const { cases } = mod.get(this.id);
      if (!id) throw new Err("No case ID was provided.", "clearCaseError");
      if (!cases.length) return undefined;
      const removed = cases.find(({ caseNum }) => caseNum === id);
      if (!removed) return undefined;
      cases.splice(removed, 1);
      mod.set(this.id, cases, "cases");
      mod.dec(this.id, "totalCases");
      return removed;
    }

    /**
     * Clears all cases of this guild.
     * @returns {Array}.
     */

    clearCases() {
      const { cases } = mod.get(this.id);
      if (!cases.length) return undefined;
      mod.set(this.id, [], "cases");
      mod.set(this.id, 0, "totalCases");
      return [];
    }
  };
});
