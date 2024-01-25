import { Request, Response, NextFunction } from "express";
import { VerifyErrors, Secret } from "jsonwebtoken";
export type JWTPayload = {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
};
export interface CustomRequest extends Request {
    user: JWTPayload;
    params: {
        id: string;
    };
    headers: {
        token?: string;
    };
}
export type { Secret, Response, VerifyErrors, NextFunction };
export declare const generateToken: (payload: JWTPayload, secret: Secret, expiresIn: string) => string;
export declare const verifyToken: (req: CustomRequest, res: Response, next: NextFunction, secret: Secret) => void;
export declare const verifyTokenAndAuthorization: (req: CustomRequest, res: Response, next: NextFunction, secret: Secret) => void;
export declare const verifyTokenAndAdmin: (req: CustomRequest, res: Response, next: NextFunction, secret: Secret) => void;
//# sourceMappingURL=jwtUtils.d.ts.map