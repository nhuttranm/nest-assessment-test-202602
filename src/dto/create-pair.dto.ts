import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePairDto {
  @ApiProperty({
    description: 'First UUID identifier',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  id1: string;

  @ApiProperty({
    description: 'Second UUID identifier',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @IsUUID()
  id2: string;
}