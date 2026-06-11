import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,  // Lets multiple users leave it empty
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      minlength: 8,
      select: false,
      required: function () {
        return this.authProvider === "local";
      },
    },

    avatar: {
      public_id: String,
      url: String,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    bio: {
      type: String,
      default: "",
    },

    skills: [String],

    githubURL: String,
    linkedinURL: String,
    portfolioURL: String,
    leetcodeURL: String,

    resume: {
      public_id: String,
      url: String,
    },

    credits: {
      type: Number,
      default: 50,
    },

    streak: {
      type: Number,
      default: 0,
    },

    totalInterviews: {
      type: Number,
      default: 0,
    },

    interviewsCompleted: {
      type: Number,
      default: 0,
    },

    averageScore: {
      type: Number,
      default: 0,
    },

    badges: [String],

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    resetPasswordToken: String,

    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);



// HASH PASSWORD (Password Hashing Middleware)
userSchema.pre("save", async function () {

  if (!this.isModified("password")) {

    return;
  }

  this.password = await bcrypt.hash(this.password, 10);

});



// COMPARE PASSWORD
userSchema.methods.comparePassword =
async function (enteredPassword) {

  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};



// GENERATE JWT
userSchema.methods.generateJWT =
function () {

  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};



// RESET PASSWORD TOKEN
userSchema.methods.getResetPasswordToken =
function () {

  const resetToken = crypto
    .randomBytes(20)
    .toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire =
    Date.now() + 15 * 60 * 1000;

  return resetToken;
};



export const User = mongoose.model(
  "User",
  userSchema
);
