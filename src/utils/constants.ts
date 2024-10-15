export const REPOSITORY = {
  USER: 'USER_REPOSITORY',
  ROLE: 'ROLE_REPOSITORY',
  SHORT: 'SHORT_REPOSITORY',
};

export const DATA_SOURCE = 'DATA_SOURCE';

export enum ROLES {
  admin = 1,
  subscriber = 2,
  free = 3,
}

export const predefinedRoles: string[] = ['admin', 'free', 'subscribed'];
