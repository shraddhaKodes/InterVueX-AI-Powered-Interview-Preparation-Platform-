import { User } from "../models/UserSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

import { generateToken } from "../utils/jwtToken.js";
import {
  findOrCreateGoogleUser,
  verifyGoogleIdToken,
} from "../services/googleAuthService.js";

import { sendEmail, verifyEmail } from "../utils/sendEmail.js";

import crypto from "crypto";

import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

// REGISTER
export const register = catchAsyncErrors(async (req, res, next) => {
  const { fullName, username, email, password } = req.body || {};
  console.log(req.body) ;
  if (!fullName || !email || !password) {
    return next(new ErrorHandler("Please fill all required fields", 400));
  }

  // PASSWORD LENGTH CHECK
  if (password.length < 8) {
    return next(
      new ErrorHandler("Password must be at least 8 characters", 400),
    );
  }

  console.log("register controller called with email:", email);
  // EMAIL EXISTS
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }

  // USERNAME EXISTS
  if (username) {
    const existingUsername = await User.findOne({
      username,
    });

    if (existingUsername) {
      return next(new ErrorHandler("Username already taken", 400));
    }
  }

  // VERIFY EMAIL
  const isValid = await verifyEmail(email);

  if (!isValid) {
    return next(new ErrorHandler("Invalid Email", 400));
  }

  let avatarData = {};

  // OPTIONAL AVATAR
  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;

    const uploadedAvatar = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      {
        folder: "INTERVIEW_PLATFORM_AVATARS",
      },
    );

    avatarData = {
      public_id: uploadedAvatar.public_id,

      url: uploadedAvatar.secure_url,
    };

    // DELETE TEMP FILE
    fs.unlinkSync(avatar.tempFilePath);
  }

  // CREATE USER
  // Initial signup credits (fixed onboarding bonus)
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    avatar: avatarData,
    credits: 50,
  });

  // SEND WELCOME EMAIL

  await sendEmail(
    email,
    "Welcome to InterVueX 🚀",
    `
  <div
    style="
      font-family: Arial, sans-serif;
      padding: 20px;
      background-color: #f4f4f4;
    "
  >

    <div
      style="
        max-width: 600px;
        margin: auto;
        background: white;
        padding: 30px;
        border-radius: 10px;
      "
    >

      <h1
        style="
          color: #4f46e5;
          text-align: center;
        "
      >
        Welcome to InterVueX 🚀
      </h1>

      <p
        style="
          font-size: 16px;
          color: #333;
        "
      >
        Hello <strong>${fullName}</strong>,
      </p>

      <p
        style="
          font-size: 15px;
          color: #555;
          line-height: 1.6;
        "
      >
        Your account has been successfully created on
        <strong>InterVueX</strong>.
      </p>

      <p
        style="
          font-size: 15px;
          color: #555;
          line-height: 1.6;
        "
      >
        You can now practice AI-powered mock interviews,
        track your progress, improve your coding skills,
        and prepare for top tech companies.
      </p>

      <div
        style="
          text-align: center;
          margin-top: 30px;
        "
      >
        <a
          href="${process.env.CLIENT_URL}"
          style="
            background: #4f46e5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
          "
        >
          Explore InterVueX
        </a>
      </div>

      <p
        style="
          margin-top: 40px;
          font-size: 13px;
          color: #888;
          text-align: center;
        "
      >
        © 2026 InterVueX. All rights reserved.
      </p>

    </div>
  </div>
  `,
  );
  generateToken(user, "Registered Successfully", 201, res);
});

// LOGIN
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return next(new ErrorHandler("Provide Email And Password!", 400));
  }

  const user = await User.findOne({ email }).select("+password authProvider");

  if (!user) {
    return next(new ErrorHandler("Invalid Email!", 404));
  }

  // GOOGLE USER CHECK
  if (user.authProvider !== "local") {
    return next(new ErrorHandler("Please login with Google", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Password", 401));
  }

  generateToken(user, "Login Successfully!", 200, res);
});

// GOOGLE LOGIN
export const googleLogin = catchAsyncErrors(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new ErrorHandler("Firebase ID token is required", 400));
  }

  const firebaseUser = await verifyGoogleIdToken(idToken);

  const user = await findOrCreateGoogleUser(firebaseUser);

  generateToken(user, "Google Login Successful", 200, res);
});

// LOGOUT
export const logout = catchAsyncErrors(async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged Out",
    });
});

// FORGOT PASSWORD
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({
    validateBeforeSave: false,
  });

  const resetUrl = `${process.env.CLIENT_URL}/password/reset/${resetToken}`;

  await sendEmail(
    user.email,
    "Reset Your InterVueX Password",
    `

  <div style="font-family: Arial, Helvetica, sans-serif; background-color:#f4f7fb; padding:30px; margin:0;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08);">

  <div style="background:#2563eb; color:#ffffff; text-align:center; padding:30px 20px;">
    <h1 style="margin:0;">InterVueX</h1>
    <p style="margin-top:10px;">AI-Powered Interview Preparation Platform</p>
  </div>

  <div style="padding:35px; color:#333333; line-height:1.7;">
    <h2 style="margin-top:0;">Password Reset Request</h2>

    <p>Hello,</p>

    <p>
      We received a request to reset the password for your InterVueX account.
      Click the button below to create a new password.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a
        href="${resetUrl}"
        style="
          background:#2563eb;
          color:#ffffff;
          text-decoration:none;
          padding:14px 28px;
          border-radius:8px;
          font-weight:bold;
          display:inline-block;
        "
      >
        Reset Password
      </a>
    </div>

    <p>
      If the button above does not work, copy and paste the following link
      into your browser:
    </p>

    <p style="word-break:break-all; color:#2563eb;">
      ${resetUrl}
    </p>

    <p>
      For security reasons, this password reset link will expire after a
      limited time.
    </p>

    <p>
      If you did not request a password reset, you can safely ignore this
      email. Your account will remain secure.
    </p>

    <p>
      Best regards,<br/>
      <strong>InterVueX Team</strong>
    </p>
  </div>

  <div style="background:#f8fafc; text-align:center; padding:20px; font-size:13px; color:#666;">
    © 2026 InterVueX. Empowering candidates to ace technical interviews.
  </div>

</div>
  </div>
  `,
  );

  res.status(200).json({
    success: true,
    message: "Reset email sent",
  });
});

// RESET PASSWORD
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,

    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired token", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = password;

  user.resetPasswordToken = undefined;

  user.resetPasswordExpire = undefined;

  await user.save();

  generateToken(user, "Password Reset Successful", 200, res);
});
