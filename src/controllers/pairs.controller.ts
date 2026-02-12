import { Controller, Post, Body, Get, Logger, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PairsService } from '../services/pairs.service';
import { CreatePairDto } from '../dto/create-pair.dto';
import { PairResponseDto } from '../dto/pair-response.dto';
import { UserPair } from '../entities/user-pair.entity';

@ApiTags('pairs')
@Controller('pairs')
export class PairsController {
  private readonly logger = new Logger(PairsController.name);

  constructor(private readonly pairsService: PairsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or find a user pair' })
  @ApiResponse({ 
    status: 201, 
    description: 'Returns the user pair with id1, id2, and userID.',
    type: PairResponseDto 
  })
  async createPair(@Body() createPairDto: CreatePairDto): Promise<PairResponseDto> {
    this.logger.log(`Received request to create pair: ${createPairDto.id1}, ${createPairDto.id2}`);
    
    const pair = await this.pairsService.findOrCreatePair(createPairDto);
    
    // Transform to response DTO format
    const responseDto: PairResponseDto = {
      id1: pair.id1,
      id2: pair.id2,
      userID: pair.userID,
    };
    
    this.logger.log(`Returning pair: ${responseDto.id1}, ${responseDto.id2}, ${responseDto.userID}`);
    return responseDto;
  }

  @Get(':id1/:id2')
  @ApiOperation({ summary: 'Get a user pair by id1 and id2' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the user pair with matching id1 and id2.',
    type: UserPair 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pair not found.' 
  })
  async findOne(@Param('id1') id1: string, @Param('id2') id2: string): Promise<UserPair> {
    this.logger.log(`Received request to find pair: ${id1}, ${id2}`);
    
    const pair = await this.pairsService.findOneByPairIds(id1, id2);
    
    if (!pair) {
      throw new Error(`Pair with id1: ${id1} and id2: ${id2} not found`);
    }
    
    this.logger.log(`Returning pair: ${pair.id1}, ${pair.id2}, ${pair.userID}`);
    return pair;
  }

  @Get()
  @ApiOperation({ summary: 'Get all user pairs' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all user pairs.',
    type: [UserPair] 
  })
  async findAll(): Promise<UserPair[]> {
    return await this.pairsService.findAll();
  }
}