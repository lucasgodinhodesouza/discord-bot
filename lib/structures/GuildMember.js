const { Structures } = require("discord.js");
const { mod } = require("../../db");
const moment = require("moment");
const { hastebin } = require("../../util/functions");
const Err = require("./CustomError");

Structures.extend("GuildMember", GuildMember => {
  return class extends GuildMember {
    constructor(...args) {
      super(...args);
    }

    /**
     * Warns a member in this guild.
     * @param {string} reason - The reason to warn.
     * @param {string} author - The author who warned this member.
     * @returns {object} The case data.
     */

    warn(reason = "No reason provided.", author) {
      const { totalCases } = mod.get(this.guild.id);
      const caseData = {
        action: "Warning",
        member: this.id,
        mod: author,
        reason,
        caseNum: totalCases + 1,
        date: moment(Date.now(), "unix").format("L")
      };
      mod.push(this.guild.id, caseData, "cases");
      mod.inc(this.guild.id, "totalCases");
      return caseData;
    }

    /**
     * Kicks a member.
     * @param {string} reason - The reason to kick.
     * @param {string} author - The author who kicked this member.
     * @returns {Promise<GuildMember>}.
     */

    kick(reason = "No reason provided.", author) {
      const { totalCases } = mod.get(this.guild.id);
      const caseData = {
        action: "Kick",
        member: this.id,
        mod: author,
        reason,
        caseNum: totalCases + 1,
        date: moment(Date.now(), "unix").format("L")
      };
      mod.push(this.guild.id, caseData, "cases");
      mod.inc(this.guild.id, "totalCases");
      super.caseData = caseData;
      return super.kick();
    }

    /**
     * Bans a member.
     * @param {string} reason - The reason to ban.
     * @param {string} author - The author who banned this member.
     * @returns {Promise<GuildMember>}.
     */

    ban(reason = "No reason provided.", author) {
      const { totalCases } = mod.get(this.guild.id);
      const caseData = {
        action: "Ban",
        member: this.id,
        mod: author,
        reason,
        caseNum: totalCases + 1,
        date: moment(Date.now(), "unix").format("L")
      };
      mod.push(this.guild.id, caseData, "cases");
      mod.inc(this.guild.id, "totalCases");
      super.caseData = caseData;
      return super.ban();
    }

    /**
     * Get warnings of this member.
     * @returns {string}.
     */

    getWarnings() {
      const { cases } = mod.get(this.guild.id);
      console.log(cases.length);
      if (!cases.length) return undefined;
      let warnings = cases.filter(
        ({ member, action }) => action === "Warning" && member === this.id
      );
      console.log(warnings.length);
      if (!warnings.length) return undefined;
      warnings = warnings
        .map(
          warning =>
            `Member: ${this.user.tag} (${this.id})\nModerator: ${warning.mod}\nCase: ${warning.caseNum}\nReason: ${warning.reason} - ${warning.date}`
        )
        .join("\n\n");
      if (warnings.length > 2000) warnings = hastebin(warnings);
      return warnings;
    }

    /**
     * Get all previous moderation logs of this member.
     * @returns {string}
     */

    getModLogs() {
      const { cases } = mod.get(this.guild.id);
      if (!cases.length) return undefined;
      const warnings = cases.filter(
        ({ member, action }) => action === "Warning" && member === this.id
      );
      const kicks = cases.filter(
        ({ member, action }) => action === "Kick" && member === this.id
      );
      const bans = cases.filter(
        ({ member, action }) => action === "Ban" && member === this.id
      );
      const mutes = cases.filter(
        ({ member, action }) => action === "Mute" && member === this.id
      );
      return `Warnings: ${warnings.length}, Kicks: ${kicks.length}, Bans: ${bans.length}, Mutes: ${mutes.length}`;
    }

    /**
     * Clears a case of this member.
     * @param {string} id - The ID of the case.
     * @returns {object} - The removed case-object.
     */

    clearCase(id) {
      const { cases } = mod.get(this.guild.id);
      if (!id) throw new Err("No case ID was provided.", "clearCaseError");
      if (!cases.length) return undefined;
      const removed = cases.find(({ caseNum }) => caseNum === id);
      if (!removed) return undefined;
      cases.splice(removed, 1);
      mod.set(this.guild.id, cases, "cases");
      return removed;
    }

    /**
     * Clears all cases of this member.
     * @param {string} action - The action, Kick/Ban/Warn.
     * @returns {Array}.
     */

    clearCases(action) {
      action = action ? action : "All";
      const { cases, totalCases } = mod.get(this.guild.id);
      if (!cases.length) return undefined;
      let filtered = null;
      if (action === "All") {
        const memberCases = cases.filter(({ member }) => member === this.id)
          .length;
        filtered = cases.filter(({ member }) => member !== this.id);
        mod.set(this.guild.id, filtered, "cases");
        mod.set(this.guild.id, totalCases - memberCases, "totalCases");
      } else {
        filtered = cases.filter(
          ({ action: act, member }) =>
            act.toLowerCase() === action.toLowerCase() && member !== this.id
        );
        mod.set(this.guild.id, filtered, "cases");
        mod.dec(this.guild.id, "totalCases");
      }
      return [];
    }

    /**
     * Get cases all cases of this member.
     * @returns {string} - All cases.
     */

    async getCases() {
      const { cases } = mod.get(this.guild.id);
      if (!cases.length) return undefined;
      let allCases = cases.filter(({ member }) => member === this.id);
      allCases = allCases
        .map(
          c =>
            `Member: ${this.user.tag} (${this.id})\nAction: ${c.action}\nModerator: ${c.mod}\nCase: ${c.caseNum}\nReason: ${c.reason} - ${c.date}`
        )
        .join("\n\n");
      if (allCases.length > 2000) allCases = await hastebin(allCases);
      return allCases;
    }

    /**
     * Mutes this member from this guild.
     * @param {string} reason - The reason to mute.
     * @param {string} author - The author who muted this member.
     */

    async mute(reason, author) {
      const { totalCases } = mod.get(this.guild.id);
      const caseData = {
        action: "Mute",
        member: this.id,
        mod: author,
        reason,
        caseNum: totalCases + 1,
        date: moment(Date.now(), "unix").format("L")
      };
      mod.push(this.guild.id, caseData, "cases");
      mod.inc(this.guild.id, "totalCases");
      const role = this.guild.findRole("Muted");
      await this.roles.add(role);
      return caseData;
    }

    /**
     * Unmute a member from this guild.
     */

    async unmute() {
      const role = this.guild.findRole("Muted");
      if (!role || !this.roles.has(role.id)) return undefined;
      await this.roles.remove(role);
      return true;
    }
  };
});
