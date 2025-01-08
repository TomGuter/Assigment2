"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).send("User already exists");
        const hashedPassword = yield bcrypt_1.default.hash(password, yield bcrypt_1.default.genSalt(10));
        const user = yield user_model_1.default.create({ email, password: hashedPassword });
        res.status(200).send(user);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const generateTokens = (_id) => {
    const random = Math.floor(Math.random() * 1000000);
    if (!process.env.TOKEN_SECRET)
        return null;
    const accessToken = jsonwebtoken_1.default.sign({ _id, random }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ _id, random }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });
    return { accessToken, refreshToken };
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).send("wrong email or password");
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return res.status(400).send("wrong email or password");
        }
        const tokens = generateTokens(user._id.toString());
        if (!tokens)
            return res.status(400).send("missing auth configuration");
        if (!user.refreshTokens)
            user.refreshTokens = [];
        user.refreshTokens.push(tokens.refreshToken);
        yield user.save();
        res.status(200).send({
            email: user.email,
            _id: user._id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    }
    catch (err) {
        res.status(400).send("error occurred");
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { refreshToken } = req.body;
    if (!refreshToken || !process.env.TOKEN_SECRET) {
        return res.status(400).send("missing refresh token or auth configuration");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET);
        const user = yield user_model_1.default.findOne({ _id: decoded._id });
        if (!user || !((_a = user.refreshTokens) === null || _a === void 0 ? void 0 : _a.includes(refreshToken))) {
            return res.status(400).send("invalid token");
        }
        user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
        yield user.save();
        res.status(200).send("logged out");
    }
    catch (err) {
        res.status(403).send("invalid token");
    }
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(400).send("invalid token");
    if (!process.env.TOKEN_SECRET)
        return res.status(400).send("missing auth configuration");
    jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (err)
            return res.status(403).send("invalid token");
        const payload = data;
        try {
            const user = yield user_model_1.default.findOne({ _id: payload._id });
            if (!user || !((_a = user.refreshTokens) === null || _a === void 0 ? void 0 : _a.includes(refreshToken)))
                return res.status(400).send("invalid token access");
            const newTokens = generateTokens(user._id.toString());
            if (!newTokens)
                return res.status(400).send("missing auth configuration");
            user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
            user.refreshTokens.push(newTokens.refreshToken);
            yield user.save();
            res.status(200).send({
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            });
        }
        catch (err) {
            res.status(400).send("invalid token access");
        }
    }));
});
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token)
        return res.status(401).send("missing token");
    if (!process.env.TOKEN_SECRET)
        return res.status(400).send("missing auth configuration");
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, data) => {
        if (err)
            return res.status(403).send("invalid token access");
        req.query.userId = data._id;
        next();
    });
};
exports.authMiddleware = authMiddleware;
exports.default = { register, login, logout, refreshToken };
//# sourceMappingURL=user_controller_auth.js.map