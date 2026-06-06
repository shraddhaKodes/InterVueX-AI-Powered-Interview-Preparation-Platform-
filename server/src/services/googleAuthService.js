import { getFirebaseAuth } from "../config/firebase.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/UserSchema.js";

const buildNameFromEmail = (email) => {
  const [name] = email.split("@");
  return name || "Google User";
};

export const verifyGoogleIdToken = async (idToken) => {
  if (!idToken) {
    throw new ErrorHandler("Firebase ID token is required", 400);
  }

  try {
    return await getFirebaseAuth().verifyIdToken(idToken);
  } catch (error) {
    throw new ErrorHandler("Invalid Firebase ID token", 401);
  }
};

export const findOrCreateGoogleUser = async (firebaseUser) => {
  const { uid, email, name, picture, email_verified: emailVerified } = firebaseUser;

  if (!email) {
    throw new ErrorHandler("Google account email is required", 400);
  }

  if (emailVerified === false) {
    throw new ErrorHandler("Google account email is not verified", 401);
  }

  const existingUser = await User.findOne({
    $or: [{ googleId: uid }, { email }],
  });

  if (existingUser) {
    let shouldSave = false;

    if (!existingUser.googleId) {
      existingUser.googleId = uid;
      shouldSave = true;
    }

    if (!existingUser.avatar?.url && picture) {
      existingUser.avatar = {
        public_id: "",
        url: picture,
      };
      shouldSave = true;
    }

    if (shouldSave) {
      await existingUser.save({ validateBeforeSave: false });
    }

    return existingUser;
  }

  return User.create({
    fullName: name || buildNameFromEmail(email),
    email,
    avatar: picture
      ? {
          public_id: "",
          url: picture,
        }
      : undefined,
    authProvider: "google",
    googleId: uid,
  });
};
