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
import { Role } from 'src/role/entities/role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'string' })
  username: string;

  @Column({ type: 'string' })
  email: string;

  @Column({ type: 'string' })
  password: string;

  @Column({ type: 'timestamp', default: Date.now() })
  created_at: Date;

  @OneToMany(() => ShortUrl, (shortUrl) => shortUrl.user_id)
  ShortUrls: ShortUrl[];

  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    console.log('in here');
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
