import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import z from "zod";

export const JWT_USER_SECRET : string | undefined= process.env.JWT_USER_SECRET;
export const MONGO_URL : string | undefined= process.env.MONGO_URL;

export {jwt, bcrypt, z};