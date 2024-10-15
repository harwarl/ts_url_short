import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum Roles {
  ADMIN = 'admin',
  FREE = 'free',
  SUBSCRIBED = 'subscribed',
}

export const predefinedRoles: string[] = ['admin', 'free', 'subscriber'];

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ type: 'string' })
  name: Roles;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  users: User[];
}
