const { MessageEmbed } = require("discord.js");
const Color = require("../../util/enum/Color");
module.exports = class Embed {
  constructor(embed = new MessageEmbed()) {
    Object.assign(this, { embed });
  }

  success() {
    return this.title("Success").color(Color.GREEN);
  }

  succesFor(text) {
    return this.title(text).color(Color.GREEN);
  }

  error() {
    return this.color(Color.RED);
  }

  errorFor(text) {
    return this.title("Error!")
      .description(text)
      .color(Color.RED);
  }

  url(url) {
    this.embed.setURL(url);
    return this;
  }

  title(text) {
    this.embed.setTitle(text);
    return this;
  }

  description(text) {
    this.embed.setDescription(text);
    return this;
  }

  thumbnail(url) {
    this.embed.setThumbnail(url);
    return this;
  }

  image(url) {
    this.embed.setImage(url);
    return this;
  }

  color(color = "RANDOM") {
    this.embed.setColor(color);
    return this;
  }

  author(text, image = null) {
    this.embed.setAuthor(text, image);
    return this;
  }

  footer(text, image = null) {
    this.embed.setFooter(text, image);
    return this;
  }

  timestamp(time) {
    this.embed.setTimestamp(time);
    return this;
  }

  field(title, text = "\u200B", inline = true) {
    this.embed.addField(title, text, inline);
    return this;
  }

  blankField() {
    this.embed.addBlankField();
    return this;
  }

  toJSON() {
    return this.embed.toJSON();
  }
};
