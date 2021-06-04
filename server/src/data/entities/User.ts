/**
 * @module entities
 */

// Dependencies
import { Field, ID, ObjectType, Root } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Local dependencies

// User entity
@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Column('bool', { default: false })
  confirmed: boolean;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Column({ default: -1 })
  tokenVersion: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  public async invalidateRefreshToken() {
    this.tokenVersion += 1;
    this.save();
  }
}
