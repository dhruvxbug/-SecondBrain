import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import z from "zod";

if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URI is not defined in environment variables");
}

if (!process.env.JWT_USER_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in environment variables");
}

if (!process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error("GOOGLE_REFRESH_TOKEN is not defined in environment variables");
}

if (!process.env.GOOGLE_USER) {
    throw new Error("GOOGLE_USER is not defined in environment variables");
}

export const JWT_USER_SECRET : string | undefined= process.env.JWT_USER_SECRET;
export const MONGO_URL : string | undefined= process.env.MONGO_URL;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
export const GOOGLE_USER = process.env.GOOGLE_USER;

export {jwt, bcrypt, z};