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
  if (!value.trim()) {
    return `${fieldName} is required`;
  }

  if (value.trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }

  return true;
};

const validateEmail = (email) => {
  if (!email.trim()) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Enter a valid email";
  }

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

const createRole = async (role, db) => {
  try {
    const input = await inquirer.prompt(inputOption);

    input.password = await bcrypt.hash(input.password, 12);

    input.role = role;
    input.createdAt = new Date();
    input.updatedAt = new Date();
    input.__v = 0;

    const User = db.collection("users");
    await User.insertOne(input);

    log(chalk.green(`${role} has been created !`));
    process.exit(0);
  } catch (err) {
    log(chalk.red(`Signup failed - ${err.message}`));
    process.exit(0);
  }
};

const exitApp = () => {
  log(chalk.blue("Goodbye! Existing the program."));
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
  MongoClient.connect(process.env.DB_URL)
    .then((conn) => {
      const db = conn.db(process.env.DB_NAME);
      welcome(db);
    })
    .catch(() => {
      log(chalk.redBright("Failed to connect with database"));
      process.exit(0);
    });
};

main();
