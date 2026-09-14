const { URL } = require('url');

/**
 * Normalizes a URL or domain string into a canonical domain name for accurate comparison.
 * Handles http/https, www prefix, trailing slashes, paths, and query parameters.
 * Examples:
 *   "https://www.abccafe.com/menu?ref=1" -> "abccafe.com"
 *   "http://abccafe.com/" -> "abccafe.com"
 *   "abccafe.com" -> "abccafe.com"
 */
function normalizeDomain(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') return '';
  let str = inputUrl.trim().toLowerCase();

  // Prepend protocol if missing so URL parser works properly
  if (!str.startsWith('http://') && !str.startsWith('https://')) {
    str = 'http://' + str;
  }

  try {
    const parsed = new URL(str);
    let hostname = parsed.hostname;

    // Remove leading 'www.'
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }

    return hostname;
  } catch (err) {
    // Fallback regex cleaning if URL parser fails on raw domains
    let cleaned = inputUrl.trim().toLowerCase();
    cleaned = cleaned.replace(/^https?:\/\//, '');
    cleaned = cleaned.replace(/^www\./, '');
    cleaned = cleaned.split('/')[0];
    cleaned = cleaned.split('?')[0];
    cleaned = cleaned.split('#')[0];
    return cleaned;
  }
}

/**
 * Validates whether a given string is a plausible website URL or domain.
 */
function isValidUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') return false;
  const str = inputUrl.trim();
  if (str.length < 3) return false;

  // Domain regex check (supports standard domains like example.com, sub.example.co.uk)
  const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/i;
  return urlPattern.test(str);
}

/**
 * Compares target domain against result URL.
 * Returns true if resultUrl matches or belongs to target domain.
 */
function isDomainMatch(targetDomain, resultUrl) {
  if (!targetDomain || !resultUrl) return false;
  const target = normalizeDomain(targetDomain);
  const resultDomain = normalizeDomain(resultUrl);

  if (!target || !resultDomain) return false;

  // Exact domain match or sub-domain match (e.g. blog.abccafe.com matching abccafe.com)
  if (resultDomain === target) return true;
  if (resultDomain.endsWith('.' + target)) return true;

  return false;
}

module.exports = {
  normalizeDomain,
  isValidUrl,
  isDomainMatch
};
