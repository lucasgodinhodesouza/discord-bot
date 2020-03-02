/*
 * Some cool utility methods for JavaScript.
 */

const { inspect } = require("util");
const fetch = require("node-fetch");

const utils = {};

/**
 * Array Grouper
 * Group array elements into 'nested arrays' sequentially.
 * @author Zytekaron
 */
utils.groupArray = (a = [], s, o) => {
  let p = [],
    r = 0;
  if (s < 1) [s, r] = [-s, 1];
  while (a.length >= s) p.push([...a.splice(0, s)]);
  if (r) p = p.map(i => i.reverse()).reverse();
  if (o) return { grouped: p, ignored: a };
  return p;
};

/**
 * A type-detector for JavaScript datatypes since `typeof` is broken.
 * @param {any} obj - The thing to check type for.
 * @author Zytekaron
 */

utils.type = obj =>
  ({}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase());

/**
 * A simple function to post codes to hastebin.
 * @param {string} content - The content to post.
 * @author Extroonie
 */

utils.hastebin = async content => {
  const key = await fetch("https://hastebin.com/documents", {
    method: "POST",
    body: content
  })
    .then(response => response.json())
    .then(body => body.key);
  return `https://hastebin.com/${key}.js`;
};

/**
 * Similar to `String#toUpperCase`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase
 * But with some special stuff.
 * @param {string} str - The string that needs to be uppercased.
 * @author Zytekaron.
 */

utils.toUpper = str => str.replace(/ .|^./g, char => char.toUpperCase());

/**
 * Join given elements and concat given arrays to a single array.
 * @param {string} data - The string to join.
 * @author Zytekaron.
 */

utils.joinif = (...data) => {
  let final = [];
  for (const item of data) {
    if (utils.type(item) == "array") final = final.concat(item);
    else if (utils.type(item) == "string") final.push(item);
    else final.push(inspect(item));
  }
  return final.join(" ");
};

/**
 * Joins array by strings.
 * @param {string} data - The array to join.
 * @author Zytekaron
 */

utils.joinby = (...data) => {
  const str = data.shift();
  let final = [];
  for (const item of data) {
    if (utils.type(item) == "array") final = final.concat(item);
    else if (utils.type(item) == "string") final.push(item);
    else final.push(inspect(item));
  }
  return final.join(str);
};

module.exports = utils;
