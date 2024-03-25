import { RoleType } from '@/types';

export const isOwner = (role: RoleType) => {
  return role === 'owner';
};

export enum FoodStatus {
  pending = 0,
  accept = 1,
  deny = 2,
  success = 3,
}
