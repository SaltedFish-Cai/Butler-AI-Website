const inBrowser = (function inBower() {
  return typeof window !== "undefined" && typeof document !== "undefined";
})();

export default inBrowser;
