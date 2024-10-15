import { ROLES } from 'src/utils/constants';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: ROLES;
}
