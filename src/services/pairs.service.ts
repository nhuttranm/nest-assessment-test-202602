import { Injectable, Logger, BadRequestException, InternalServerErrorException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, QueryFailedError } from 'typeorm';
import { UserPair } from '../entities/user-pair.entity';
import { CreatePairDto } from '../dto/create-pair.dto';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PairsService {
  private readonly logger = new Logger(PairsService.name);

  constructor(
    @InjectRepository(UserPair)
    private userPairRepository: Repository<UserPair>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findOrCreatePair(dto: CreatePairDto): Promise<UserPair> {
    const { id1, id2 } = dto;

    // First, check in cache
    const cacheKey = `pair_${id1}_${id2}`;
    let pair = await this.cacheManager.get<UserPair>(cacheKey);
    
    if (pair) {
      this.logger.log(`Found pair in cache: ${id1}, ${id2}`);
      return pair;
    }

    // If not in cache, check in database
    const whereCondition: FindOptionsWhere<UserPair> = { id1, id2 };
    
    pair = await this.userPairRepository.findOne({
      where: whereCondition,
    });

    if (pair) {
      // Cache the result
      await this.cacheManager.set(cacheKey, pair, 300000); // Cache for 5 minutes
      this.logger.log(`Found existing pair in database: ${id1}, ${id2}`);
      return pair;
    }

    // If not found, create a new one
    try {
      const newPair = new UserPair();
      newPair.id1 = id1;
      newPair.id2 = id2;
      newPair.userID = uuidv4(); // Generate new UUID for userID

      const savedPair = await this.userPairRepository.save(newPair);
      
      // Cache the new result
      await this.cacheManager.set(cacheKey, savedPair, 300000); // Cache for 5 minutes
      this.logger.log(`Created new pair: ${id1}, ${id2} with userID: ${savedPair.userID}`);
      
      return savedPair;
    } catch (error) {
      if (error instanceof QueryFailedError && error.message.includes('UNIQUE constraint failed')) {
        // Handle race condition where another request created the same pair
        // Check again in database
        const existingPair = await this.userPairRepository.findOne({
          where: { id1, id2 },
        });
        
        if (existingPair) {
          // Cache the result
          await this.cacheManager.set(cacheKey, existingPair, 300000); // Cache for 5 minutes
          this.logger.log(`Found existing pair after race condition: ${id1}, ${id2}`);
          return existingPair;
        }
      }
      
      this.logger.error(`Error creating pair: ${error.message}`);
      throw new InternalServerErrorException('Failed to create pair');
    }
  }

  async findAll(): Promise<UserPair[]> {
    return await this.userPairRepository.find();
  }

  async findOneByPairIds(id1: string, id2: string): Promise<UserPair> {
    // First, check in cache
    const cacheKey = `pair_${id1}_${id2}`;
    let pair = await this.cacheManager.get<UserPair>(cacheKey);
    
    if (pair) {
      this.logger.log(`Found pair in cache: ${id1}, ${id2}`);
      return pair;
    }

    // If not in cache, check in database
    const whereCondition: FindOptionsWhere<UserPair> = { id1, id2 };
    
    pair = await this.userPairRepository.findOne({
      where: whereCondition,
    });

    if (pair) {
      // Cache the result
      await this.cacheManager.set(cacheKey, pair, 300000); // Cache for 5 minutes
      this.logger.log(`Found existing pair in database: ${id1}, ${id2}`);
      return pair;
    }

    return null; // Return null if not found
  }

  async findOne(id: string): Promise<UserPair> {
    return await this.userPairRepository.findOneBy({ id });
  }
}