import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ShortUrl } from 'src/short/entities/short.entity';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'string' })
  username: string;

  @Column({ type: 'string' })
  email: string;

  @Column({ type: 'string' })
  passsword: string;

  @Column({ type: 'timestamp', default: Date.now() })
  created_at: Date;

  @OneToMany(() => ShortUrl, (shortUrl) => shortUrl.user_id)
  ShortUrls: ShortUrl[];

  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.passsword) {
      this.passsword = await bcrypt.hash(this.passsword, 10);
    }
  }
}
