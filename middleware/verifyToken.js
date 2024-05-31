const jwt = require("jsonwebtoken");
const SECRET_KEY = "abcdefghigklmiopqrstuvwxyz";

const verifyToken = async (req, res, next) => {
  try {
    const headerToken = req.headers["authorization"];

    if (!headerToken || headerToken === undefined) {
      return res.status(401).json({ message: "Token is required" });
    }
    const bearerToken = headerToken.split(" ");
    const token = bearerToken[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err && req.userID.status == false) {
        if (err.name === "TokenExpiredError") {
          console.error("Token expired:", err.message);
          return res.status(401).json({ message: "Token is expired" });
        }
        // else {
        //   console.error('Invalid token:', err.message);
        //   return res.status(401).json({ message: 'Invalid token' });
        // }
      } else {
        req.userID = decoded.id;
        next();
      }
    });
  } catch (error) {
    console.error("Error while verifying token:", error.message);
    res.status(500).json({ message: "Invalid Token" });
  }
};

module.exports = { verifyToken };
