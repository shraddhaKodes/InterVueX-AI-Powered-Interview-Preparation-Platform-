export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJWT();   //use schema method to generate JWT

  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10) || 1;
  const expireDate = new Date(
    Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000,
  );

  // Remove password field if present
  const userObj = user.toObject ? user.toObject() : { ...user };
  if (userObj.password) delete userObj.password;

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: expireDate,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    })
    .json({
      success: true,
      message,
      token,
      user: userObj,
    });
};
