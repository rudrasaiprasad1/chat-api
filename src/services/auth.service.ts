import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "./user.service";
import { env } from "../config/env";
import { generateAccessToken } from "../utils/jwt";


export const registerUser = async (userId: string, email: string, password: string, createdAt:number) => {
    const existing = await getUserByEmail(email);

    if (existing) {
        throw new Error("User already exists");
    }

    const user = await createUser(userId, email, password, createdAt);

    const token = generateAccessToken({
        userId: user.userId,
        email: user.email,
    });

    const { password: _, ...safeUser } = user;

    return {
        token,
        user: safeUser,
    };
};


export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.userId, email: user.email },
    env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
};
