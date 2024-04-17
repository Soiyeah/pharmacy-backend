import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();
interface AuthorizedRequest extends Request {
  user?: any;
}

export const authorize = (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access token is missing" });
  }

  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
      user: any;
    };
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
