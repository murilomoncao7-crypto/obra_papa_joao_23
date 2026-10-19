// Offline font responses for the isolated editorial browser tests only.
module.exports = new Proxy(
  {},
  {
    get(_target, url) {
      const family = new URL(url).searchParams.get("family").split(":")[0];
      return `@font-face { font-family: '${family}'; src: local('Arial'); }`;
    },
  },
);
