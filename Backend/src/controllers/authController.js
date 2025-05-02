import bcrypt from "bcryptjs";
import User from "../models/user.js";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      isMfaActive: false,
    });
    console.log("New User: ", newUser);
    await newUser.save();
    res.status(201).json({ message: "User registered Succesfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user", message: error });
  }
};

export const login = async (req, res) => {
  console.log("the Authenticated user is :", req.user);
  res.status(200).json({
    message: "User logged in Successfully",
    username: req.user.username,
    isMfaActive: req.user.isMfaActive,
  });
};

export const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User logged in Successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(401).json({ message: "Unauthorized User" });
  }
};

export const logout = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized User" });

  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid"); // ✅ Fixed here
      res.status(200).json({ message: "Logged Out Successfully" });
    });
  });
};


export const setup2FA = async (req, res) => {
  try {
    console.log("The Req.user is : ", req.user);
    const user = req.user;
    const secret = speakeasy.generateSecret();
    console.log("the secret obj is :", secret);
    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    await user.save();

    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "www.anaygupta.com",
      encoding: "base32",
    });
    const qrImgUrl = await qrCode.toDataURL(url);

    res.status(200).json({
      qrCode: qrImgUrl,
      secret: secret.base32, // ✅ Send this so frontend can display/copy it
    });
  } catch (error) {
    res.status(500).json({ error: "Error setting up 2Fa", message: error });
  }
};

export const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (verified) {
      // Generate a JWT or mark session verified
      const jwtToken = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1hr" }
      );
      res
        .status(200)
        .json({ message: "2FA verification successful", token: jwtToken });
    } else {
      res.status(400).json({ message: "Invalid 2FA token" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error verifying 2FA", message: error.message });
  }
};

export const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.twoFactorSecret = "";
    user.isMfaActive = false;
    await user.save();
    res.status(200).json({ message: "2FA reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting 2FA", message: error });
  }
};
