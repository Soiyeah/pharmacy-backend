import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database";
import { config } from "dotenv";

config();

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const user: any = row;
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    console.log(user);
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET_KEY
    );
    res.json({ token });
  });
};
