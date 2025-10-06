const jwt = require("jsonwebtoken");

exports.verifyAgent = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;
    if (decoded.type !== "agent") {
      return res.status(403).json({ message: "Accès réservé aux agents" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
