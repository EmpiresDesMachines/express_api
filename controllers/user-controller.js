const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserContorller = {
  register: async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields required." });
    }
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });

      res.json(user);
    } catch (error) {
      console.error("Error in register.", error);
      res.status(500).json({ error: "Internal server error." });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields required." });
    }
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Wrong email or password." });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ error: "Wrong email or password." });
      }
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
      res.send({ token });
    } catch (error) {
      console.error("Login error", error);
      res.status(500).json({ error: "Internal server error." });
    }
  },
  getUserById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
      if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        return res.status(404).json({ error: "User not found." });
      }
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      res.send({ user });
    } catch (error) {
      console.error("Get Current Error", error);
      res.status(500).json({ error: "Internal server errror." });
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { email, name } = req.body;
    if (id !== req.user.userId) {
      return res.status(403).json({ error: "Cannot access." });
    }
    try {
      if (email) {
        const existingUser = await prisma.user.findFirst({
          where: { email },
        });
        if (existingUser && existingUser.id !== id) {
          return res
            .status(400)
            .json({ error: "This email is already in use." });
        }
      }
      const user = await prisma.user.update({
        where: { id },
        data: {
          email: email || undefined,
          name: name || undefined,
        },
      });
      res.json(user);
    } catch (error) {
      console.error("Update user error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  current: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.userId,
        },
      });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Get current user error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = UserContorller;
