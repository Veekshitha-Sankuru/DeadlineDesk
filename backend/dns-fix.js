/**
 * dns-fix.js — Local-network DNS workaround.
 *
 * Why this exists:
 * On some machines the configured DNS server (e.g. a home router on
 * 192.168.1.1) refuses DNS queries. Node.js resolves hostnames via that
 * server, so every connection (MongoDB Atlas, npm registry, anything)
 * fails with errors like `querySrv ECONNREFUSED` / `getaddrinfo ENOTFOUND`.
 * Meanwhile the Windows DNS client (used by PowerShell) may still work via
 * encrypted DNS (DoH), which is why the problem only shows up in Node.
 *
 * What this does:
 * It first tries a quick DNS lookup with the system's default servers.
 * If that works, this module does nothing — so on a healthy network it is a
 * complete no-op and safe to leave in the project.
 * If the default lookup fails, it forces Node's DNS resolver (both the
 * c-ares `resolve*` functions and `dns.lookup`, which net/mongoose use for
 * TCP connections) to use public resolvers (Google 8.8.8.8 / Cloudflare
 * 1.1.1.1) instead of the broken local server.
 *
 * Usage (server.js):
 *   const ensureDns = require("./dns-fix");
 *   await ensureDns();   // before connecting to MongoDB
 *
 * Fix the real issue when you can: set a working DNS server in your OS
 * network settings (e.g. 8.8.8.8 / 1.1.1.1) or fix/restart your router's DNS.
 * Then this module will stop activating on its own.
 */

const dns = require("dns");

const PUBLIC_DNS = ["8.8.8.8", "1.1.1.1"];

/**
 * Check whether the current system DNS can resolve a known host.
 */
function systemDnsWorks() {
  // A fresh Resolver honours the system-configured servers (not setServers).
  const resolver = new dns.promises.Resolver();
  return resolver
    .resolve4("dns.google")
    .then(() => true)
    .catch(() => false);
}

/**
 * Install public-DNS resolution for both dns.resolve* and dns.lookup.
 */
function installPublicDns() {
  // 1) c-ares: dns.resolve4/6/Srv now use the public servers.
  dns.setServers(PUBLIC_DNS);

  // 2) dns.lookup is used by net.Socket.connect (i.e. mongoose's TCP
  //    connections to the MongoDB hosts). Override it to resolve via c-ares
  //    so it also benefits from the public servers.
  const originalLookup = dns.lookup;
  dns.lookup = function lookupViaPublicDns(hostname, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    const family = options && options.family;
    const wantAll = !!(options && options.all);

    Promise.all([
      dns.promises
        .resolve4(hostname)
        .then((a) => a.map((address) => ({ address, family: 4 })))
        .catch(() => []),
      dns.promises
        .resolve6(hostname)
        .then((a) => a.map((address) => ({ address, family: 6 })))
        .catch(() => []),
    ])
      .then(([v4, v6]) => {
        const all = [...v4, ...v6];
        if (all.length === 0) {
          // Nothing resolved; fall back to the original system lookup.
          return originalLookup(hostname, options, callback);
        }
        if (wantAll) return callback(null, all);
        let chosen = all[0];
        if (family === 4) chosen = all.find((a) => a.family === 4) || chosen;
        if (family === 6) chosen = all.find((a) => a.family === 6) || chosen;
        return callback(null, chosen.address, chosen.family);
      })
      .catch(() => originalLookup(hostname, options, callback));
  };

  console.log("⚠️  System DNS unreachable — using public resolvers (8.8.8.8 / 1.1.1.1) for this process.");
  console.log("   Tip: set a working DNS server in your OS network settings to fix this permanently.");
}

/**
 * Ensure DNS resolution works for this process. Call (and await) this before
 * connecting to MongoDB. No-op when the system DNS is healthy.
 * @returns {Promise<void>}
 */
async function ensureDns() {
  try {
    const ok = await systemDnsWorks();
    if (!ok) installPublicDns();
  } catch (e) {
    // If the check itself blows up, apply the workaround to be safe.
    installPublicDns();
  }
}

module.exports = ensureDns;
