const jwtConfig = {
  secret: String(process.env.JWT_SECRET),
  expiresIn: String(process.env.JWT_EXPIRES_IN),
  refreshSecret: String(process.env.JWT_REFRESH_SECRET),
  refreshExpiresIn: String(process.env.JWT_REFRESH_EXPIRES_IN),
};
export { jwtConfig };
