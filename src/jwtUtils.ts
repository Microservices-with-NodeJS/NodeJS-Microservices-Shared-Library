// shared-library/src/jwtUtils.ts
import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors, Secret } from "jsonwebtoken";

// Define the JWT payload type
export type JWTPayload = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

// Custom Request type with 'user' property
export interface CustomRequest extends Request {
  user: JWTPayload;
  params: {
    id: string;
  };
  headers: {
    token?: string;
  };
}

// Export types used in the library
export type { Secret, Response, VerifyErrors, NextFunction };

// Generate JWT token
export const generateToken = (
  payload: JWTPayload,
  secret: Secret,
  expiresIn: string
): string => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};

// Verify JWT token middleware
export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  secret: Secret
): void => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = Array.isArray(authHeader)
      ? authHeader[0].split(" ")[1]
      : authHeader.split(" ")[1];

    jwt.verify(token, secret, (err: VerifyErrors | null, user: any) => {
      if (err) {
        // Use the res object with a status function
        res.status(403).json("Token is not valid!");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    // Use the res object with a status function
    res.status(401).json("You are not authenticated!");
  }
};

// Authorize account owner middleware
export const verifyTokenAndAuthorization = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  secret: Secret
): void => {
  verifyToken(
    req,
    res,
    () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not allowed to do that!");
      }
    },
    secret
  );
};

// Authorize admin middleware
export const verifyTokenAndAdmin = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  secret: Secret
): void => {
  verifyToken(
    req,
    res,
    () => {
      if (req.user.isAdmin) {
        next();
      } else {
        return res.status(403).json("You are not allowed to do that!");
      }
    },
    secret
  );
};
