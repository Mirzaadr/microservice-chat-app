// import express, { Request, Response } from "express";
import { Request, ResponseToolkit } from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import { User, IUser } from "../database";
import { ApiError, encryptPassword, isPasswordMatch } from "../utils";
import config from "../config";

const jwtSecret = config.JWT_SECRET as string;
const COOKIE_EXPIRATION_DAYS = 90; // cookie expiration in days
const expirationDate = new Date(
    Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
);
const cookieOptions = {
    expires: expirationDate,
    secure: false,
    httpOnly: true,
};

const register = async (req: Request, res: ResponseToolkit) => {
    try {
        const { name, email, password } = req.payload as { name: string, email: string, password: string};
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new ApiError(400, "User already exists!");
        }

        const user = await User.create({
            name,
            email,
            password: await encryptPassword(password),
        });

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
        };

        return res.response({
            status: 200,
            message: "User registered successfully!",
            data: userData,
        });
    } catch (error: any) {
        return res.response({
            status: 500,
            message: error.message,
        });
    }
};

const createSendToken = async (user: IUser, res: ResponseToolkit) => {
    const { name, email, id } = user;
    // const token = Jwt.sign({ name, email, id }, jwtSecret, {
    //     expiresIn: "1d",
    // });
    const token = Jwt.token.generate({
      expiresIn: 36000,
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      maxAgeSec: 14400,
      timeSkewSec: 15,
      name,
      email,
      id
    }, jwtSecret)
    if (config.env === "production") cookieOptions.secure = true;
    // res.cookie("jwt", token, cookieOptions);

    return token;
};

const login = async (req: Request, res: ResponseToolkit) => {
    try {
        const { email, password } = req.payload as { email: string, password: string };
        const user = await User.findOne({ email }).select("+password");
        if (
            !user ||
            !(await isPasswordMatch(password, user.password as string))
        ) {
            throw new ApiError(400, "Incorrect email or password");
        }

        const token = await createSendToken(user!, res);

        return res.response({
            status: 200,
            message: "User logged in successfully!",
            token,
        });
    } catch (error: any) {
        return res.response({
            status: 500,
            message: error.message,
        });
    }
};

export default {
    register,
    login,
};
