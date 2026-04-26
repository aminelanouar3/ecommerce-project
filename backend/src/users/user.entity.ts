import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Address } from '../addresses/address.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'customer' })
  role: string;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  // 🔐 Forgot password
  @Column({ type: 'varchar', nullable: true })
resetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date | null;
}