export type RoleType = 'owner' | 'staff';

export type JwtDecoded = {
  id: string;
  company_id: string;
  role: RoleType;
};

export type TokenType = 'accessToken' | 'refreshToken';
