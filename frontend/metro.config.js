const path = require("node:path");
const {getDefaultConfig} = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Stub transitive deps from @terreno/ui that don't bundle cleanly under
// Metro and aren't used in this project. jspdf's `main` (node) build
// uses AMD-style `require([...], cb)` which Metro can't parse, and
// html2canvas pulls in window-only globals.
const STUBBED = new Set(["jspdf", "html2canvas"]);
const STUB_PATH = path.resolve(__dirname, "scripts/empty-module.js");

const baseResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const root = moduleName.split("/")[0];
  if (STUBBED.has(root) || STUBBED.has(moduleName)) {
    return {type: "sourceFile", filePath: STUB_PATH};
  }
  if (baseResolveRequest) {
    return baseResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
