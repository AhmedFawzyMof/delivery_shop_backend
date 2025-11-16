import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { verifySessionToken } from "../utils/token";

const SESSION_SECRET = process.env.JWT_SESSION_SECRET as string;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ message: "Missing token" });

  const token = header.split(" ")[1];
  const decoded = verifySessionToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }

  (req as any).user = decoded;
  next();
};

export { authMiddleware };
