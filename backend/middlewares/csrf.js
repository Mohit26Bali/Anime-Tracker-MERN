// CSRF defence for cookie-based auth, with no tokens to manage:
//  1. If the browser sends an Origin header on a state-changing request, it must be CLIENT_URL.
//  2. State-changing requests must carry the custom header X-Requested-With.
// A cross-site page cannot set a custom header without passing a CORS preflight,
// and the CORS allow-list only permits CLIENT_URL.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const normalize = (url) => (url || "").replace(/\/+$/, "");

const csrfProtection = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get("origin");
  if (origin && normalize(origin) !== normalize(process.env.CLIENT_URL)) {
    return res.status(403).json({ message: "Cross-origin request blocked" });
  }

  if (!req.get("x-requested-with")) {
    return res.status(403).json({ message: "Missing X-Requested-With header" });
  }

  next();
};

export default csrfProtection;
