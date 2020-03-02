class ArgumentHandler {
  constructor() {}

  exec(args, commandArgs) {
    const arr = args
      .join(" ")
      .split("|")
      .map(a => a.trim())
      .map((a, i) => {
        return ([commandArgs[i]] = a);
      });
    return arr;
  }
}
module.exports = ArgumentHandler;