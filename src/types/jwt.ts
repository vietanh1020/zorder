export type JwtDecoded = {
  id: string;
  company_id: string;
  role: string;
};

export type TokenType = 'accessToken' | 'refreshToken';
