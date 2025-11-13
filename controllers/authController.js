import bcrypt from "bcrypt";
import User from "../models/userModel.js";

export const signUp = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    req.session.user = newUser;
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    console.log(e);

    res.status(400).json({
      staus: "fail",
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      username,
    });

    if (!user) {
      res.status(404).json({
        status: "Fail",
        message: "user not found",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      req.session.user = user;

      res.status(200).json({
        status: "success",
        message: "Logged in successfully",
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "incorrect username or password",
      });
    }
  } catch (e) {
    console.log(e);

    res.status(400).json({
      staus: "fail",
    });
  }
};
