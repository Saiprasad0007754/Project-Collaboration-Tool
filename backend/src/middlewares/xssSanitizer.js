/**
 * Lightweight recursive sanitizer that strips common XSS vectors
 * (script tags, inline event handlers, javascript: URIs) from
 * string values in req.body, req.query, and req.params.
 *
 * Written in-house instead of using the deprecated `xss-clean`
 * package, which is unmaintained and increasingly incompatible
 * with current Express/Node versions.
 */
const SCRIPT_TAG_REGEX = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const ON_EVENT_ATTR_REGEX = /\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_URI_REGEX = /javascript:/gi;
const HTML_TAG_REGEX = /<\/?[a-z][\s\S]*?>/gi;

const sanitizeValue = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(SCRIPT_TAG_REGEX, '')
    .replace(ON_EVENT_ATTR_REGEX, '')
    .replace(JS_URI_REGEX, '')
    .replace(HTML_TAG_REGEX, '');
};

const sanitizeObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [key, sanitizeObject(val)])
    );
  }
  return sanitizeValue(obj);
};

const xssSanitizer = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

module.exports = xssSanitizer;
