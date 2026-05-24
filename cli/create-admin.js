import dotenv from "dotenv";
dotenv.config();

import chalk from "chalk";
import inquirer from "inquirer";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

const log = console.log;

const promptOption = [
  {
    type: "list",
    name: "role",
    message: "Enter role (user/admin/exit):",
    choices: ["user", "admin", "exit"],
  },
];

const validateInput = (value, fieldName, minLength = 3) => {
  if (!value.trim()) return `${fieldName} is required`;
  if (value.trim().length < minLength)
    return `${fieldName} must be at least ${minLength} characters`;
  return true;
};

const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Enter a valid email";

  return true;
};

const inputOption = [
  {
    type: "input",
    name: "fullname",
    message: "Enter your fullname:",
    validate: (input) => validateInput(input, "Fullname"),
  },
  {
    type: "input",
    name: "email",
    message: "Enter your email:",
    validate: validateEmail,
  },
  {
    type: "password",
    name: "password",
    message: "Enter your password:",
    mask: "*",
    validate: (input) => validateInput(input, "Password"),
  },
];

let client;

// 🔥 BUILD MONGODB URI FROM ENV
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const DB_PARAMS = process.env.DB_PARAMS || "";

const MONGO_URI = `${DB_URL}/${DB_NAME}${DB_PARAMS}`;

const createRole = async (role, db) => {
  try {
    const input = await inquirer.prompt(inputOption);

    const users = db.collection("users");

    const existingUser = await users.findOne({ email: input.email });
    if (existingUser) {
      log(chalk.red("Email already exists!"));
      return;
    }

    input.password = await bcrypt.hash(input.password, 12);

    input.role = role;
    input.createdAt = new Date();
    input.updatedAt = new Date();

    await users.insertOne(input);

    log(chalk.green(`${role} created successfully!`));

    await client.close();
    process.exit(0);
  } catch (err) {
    log(chalk.red(`Signup failed - ${err.message}`));
    await client?.close();
    process.exit(1);
  }
};

const exitApp = async () => {
  log(chalk.blue("Goodbye! Exiting program."));
  await client?.close();
  process.exit(0);
};

const welcome = async (db) => {
  log(chalk.bgRed.white.bold(" 🌟 Admin signup console 🌟 "));

  const { role } = await inquirer.prompt(promptOption);

  if (role === "user" || role === "admin") {
    return createRole(role, db);
  }

  return exitApp();
};

const main = async () => {
  try {
    client = new MongoClient(MONGO_URI);

    await client.connect();

    const db = client.db(DB_NAME);

    await welcome(db);
  } catch (err) {
    log(chalk.redBright("Failed to connect with database: " + err.message));
    await client?.close();
    process.exit(1);
  }
};

main();