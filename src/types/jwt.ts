export type RoleType = 'owner' | 'staff';

export type JwtDecoded = {
  id: string;
  email: string;
  company_id: string;
  role: RoleType;
};

export type TokenType = 'accessToken' | 'refreshToken';
