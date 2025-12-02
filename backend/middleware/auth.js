import jwt from "jsonwebtoken";
import service from "../api/Auth/service.js";
import Unauthorized from "../helper/unauthorized.js";


async function auth(req, res, next) {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ success: false, message: "Please login to continue." });
    }

    token = token.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      audience: "loginAccess",
    });

    const user = await service.findUserById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "Please login to continue." });
    if (user.Deactivated) return res.status(403).json({ success: false, message: "Your account is not active. Contact support." });

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Your session has expired. Please login again." });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Authentication failed. Please login again." });
    }
    next(err); 
  }
}


export default auth;
