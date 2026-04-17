interface IJwtProvider {
  signAccessToken(payload: object): string;
  signRefreshToken(payload: object): string;
  verifyRefreshToken(token: string): object;
}

export default IJwtProvider;
