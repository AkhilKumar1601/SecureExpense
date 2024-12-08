import { Request, Response, NextFunction } from "express";

const checkRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; // Assuming the user is added to the request by the verifyToken middleware

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return 
    }

    if (user.role !== role) {
      res.status(403).json({ message: "Forbidden: Insufficient privileges" });
      return 
    }

    next();
  };
};

export default checkRole;
