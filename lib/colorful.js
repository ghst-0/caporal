import * as c from 'colorette';

export const colorize = (text) => {
  return text.replaceAll(/<([^>]+)>/gi, (match) => {
    return c.blue(match);
  }).replaceAll('<command>', (match) => {
    return c.magenta(match);
  }).replaceAll(/\[([^[\]]+)]/gi, (match) => {
    return c.yellow(match);
  }).replaceAll(/ --?([^\s,]+)/gi, (match) => {
    return c.green(match);
  });
};
