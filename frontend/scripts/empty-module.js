// No-op stub used by metro.config.js to short-circuit unused
// transitive deps that don't bundle cleanly under Metro (e.g. jspdf's
// AMD-style require, or html2canvas's window-only globals).
//
// Anything that touches these at runtime will get a function that
// returns undefined. We don't use PDF export or html2canvas in this
// project — they ride in via @terreno/ui — so silently no-op'ing is
// correct.

const noop = () => undefined;
const stub = new Proxy(noop, {
  get: () => stub,
  apply: () => stub,
  construct: () => stub,
});

module.exports = stub;
module.exports.default = stub;
