import jwt from "jsonwebtoken";

const SESSION_SECRET = process.env.JWT_SESSION_SECRET as string;

type TokenDuration = "1d" | "2h" | "4h" | "8h" | "12h";

const createSessionToken = (payload: object, duration: TokenDuration) => {
  return jwt.sign(payload, SESSION_SECRET, { expiresIn: duration });
};

const verifySessionToken = (token: string) => {
  try {
    return jwt.verify(token, SESSION_SECRET);
  } catch {
    return null;
  }
};

export { createSessionToken, verifySessionToken };
