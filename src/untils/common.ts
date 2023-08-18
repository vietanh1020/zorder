import { RoleType } from '@/types';

export const isOwner = (role: RoleType) => {
  return role === 'owner';
};
