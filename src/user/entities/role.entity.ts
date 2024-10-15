import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';

export enum Roles {
  FREE = 'free',
  SUBSCRIBED = 'subscribed',
}

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ type: 'string' })
  name: Roles;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
