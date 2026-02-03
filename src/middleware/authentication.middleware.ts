import { Request, Response, NextFunction } from "express";
import { verifySessionToken } from "../utils/token";
import { RoleType } from "../constants/roleTypes";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const roleMiddleware = (allowedRoles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.type) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(user.type)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

export const permissionMiddleware = (requiredPermission: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.data.role.permissions) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (
      !user.data.role.permissions.some((permission: string) =>
        requiredPermission.includes(permission)
      )
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
