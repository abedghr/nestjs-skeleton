import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity('members')
@Index('email-unique-ndx', ['email'], { unique: true })
export class MemberEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  gender: string;
}
