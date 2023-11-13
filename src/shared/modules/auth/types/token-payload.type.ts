import { UserType } from '../../../types/user-type.enum.js';

export type TokenPayload = {
  name: string;
  email: string;
  userType: UserType;
  id: string;
};
