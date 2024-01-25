"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenAndAdmin = exports.verifyTokenAndAuthorization = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate JWT token
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
    return token;
};
exports.generateToken = generateToken;
// Verify JWT token middleware
const verifyToken = (req, res, next, secret) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = Array.isArray(authHeader)
            ? authHeader[0].split(" ")[1]
            : authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, secret, (err, user) => {
            if (err) {
                // Use the res object with a status function
                res.status(403).json("Token is not valid!");
            }
            else {
                req.user = user;
                next();
            }
        });
    }
    else {
        // Use the res object with a status function
        res.status(401).json("You are not authenticated!");
    }
};
exports.verifyToken = verifyToken;
// Authorize account owner middleware
const verifyTokenAndAuthorization = (req, res, next, secret) => {
    (0, exports.verifyToken)(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("You are not allowed to do that!");
        }
    }, secret);
};
exports.verifyTokenAndAuthorization = verifyTokenAndAuthorization;
// Authorize admin middleware
const verifyTokenAndAdmin = (req, res, next, secret) => {
    (0, exports.verifyToken)(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }
        else {
            return res.status(403).json("You are not allowed to do that!");
        }
    }, secret);
};
exports.verifyTokenAndAdmin = verifyTokenAndAdmin;
