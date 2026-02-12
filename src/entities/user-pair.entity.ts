import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, BeforeInsert, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

@Entity('user_pairs')
@Unique(['id1', 'id2']) // Ensure the combination of id1 and id2 is unique
export class UserPair {
  @ApiProperty({
    description: 'Unique identifier for the pair record',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'First UUID identifier in the pair',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @Column({ 
    type: 'uuid',
    nullable: false
  })
  @Index()
  id1: string;

  @ApiProperty({
    description: 'Second UUID identifier in the pair',
    example: '550e8400-e29b-41d4-a716-446655440002'
  })
  @Column({ 
    type: 'uuid',
    nullable: false
  })
  @Index()
  id2: string;

  @ApiProperty({
    description: 'User UUID identifier associated with the pair',
    example: '550e8400-e29b-41d4-a716-446655440003'
  })
  @Column({ 
    type: 'uuid',
    nullable: false
  })
  userID: string;

  @ApiProperty({
    description: 'Timestamp when the record was created',
    example: '2023-01-01T00:00:00.000Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the record was last updated',
    example: '2023-01-01T00:00:00.000Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Generate UUID values before inserting only if not already provided
  @BeforeInsert()
  beforeInsert() {
    if (!this.id) {
      this.id = uuidv4();
    }
    if (!this.id1) {
      this.id1 = uuidv4();
    }
    if (!this.id2) {
      this.id2 = uuidv4();
    }
    if (!this.userID) {
      this.userID = uuidv4();
    }
  }
}