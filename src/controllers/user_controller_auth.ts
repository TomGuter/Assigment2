import { Request, Response, NextFunction } from "express";
import userModel from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );
    const user = await userModel.create({ email, password: hashedPassword });
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

const generateTokens = (_id: string) => {
  const random = Math.floor(Math.random() * 1000000);
  if (!process.env.TOKEN_SECRET) return null;

  const accessToken = jwt.sign({ _id, random }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
  const refreshToken = jwt.sign({ _id, random }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });

  return { accessToken, refreshToken };
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("wrong email or password");

  try {
    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send("wrong email or password");
    }

    const tokens = generateTokens(user._id.toString());
    if (!tokens) return res.status(400).send("missing auth configuration");

    if (!user.refreshTokens) user.refreshTokens = [];
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    res.status(200).send({
      email: user.email,
      _id: user._id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    res.status(400).send("error occurred");
  }
};

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !process.env.TOKEN_SECRET) {
    return res.status(400).send("missing refresh token or auth configuration");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET
    ) as TokenPayload;
    const user = await userModel.findOne({ _id: decoded._id });

    if (!user || !user.refreshTokens?.includes(refreshToken)) {
      return res.status(400).send("invalid token");
    }

    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken
    );
    await user.save();
    res.status(200).send("logged out");
  } catch (err) {
    res.status(403).send("invalid token");
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).send("invalid token");

  if (!process.env.TOKEN_SECRET)
    return res.status(400).send("missing auth configuration");

  jwt.verify(
    refreshToken,
    process.env.TOKEN_SECRET,
    async (err: any, data: any) => {
      if (err) return res.status(403).send("invalid token");

      const payload = data as TokenPayload;
      try {
        const user = await userModel.findOne({ _id: payload._id });
        if (!user || !user.refreshTokens?.includes(refreshToken))
          return res.status(400).send("invalid token access");

        const newTokens = generateTokens(user._id.toString());
        if (!newTokens)
          return res.status(400).send("missing auth configuration");

        user.refreshTokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        user.refreshTokens.push(newTokens.refreshToken);
        await user.save();

        res.status(200).send({
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        });
      } catch (err) {
        res.status(400).send("invalid token access");
      }
    }
  );
};

type TokenPayload = { _id: string };

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).send("missing token");

  if (!process.env.TOKEN_SECRET)
    return res.status(400).send("missing auth configuration");

  jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
    if (err) return res.status(403).send("invalid token access");

    req.query.userId = (data as TokenPayload)._id;
    next();
  });
};

export default { register, login, logout, refreshToken };
