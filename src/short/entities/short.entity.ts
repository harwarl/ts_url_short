import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'urls ' })
export class ShortUrl {
  @PrimaryGeneratedColumn()
  short_id: number;

  @Column({ type: 'string' })
  original_url: string;

  @Column({ type: 'datetime' })
  expires_at: Date;

  @Column({ type: 'datetime' })
  created_at: Date;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.ShortUrls)
  user: User;
}
