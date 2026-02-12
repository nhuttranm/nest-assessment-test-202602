import { Test, TestingModule } from '@nestjs/testing';
import { PairsController } from '../src/controllers/pairs.controller';
import { PairsService } from '../src/services/pairs.service';
import { CreatePairDto } from '../src/dto/create-pair.dto';
import { UserPair } from '../src/entities/user-pair.entity';
import { v4 as uuidv4 } from 'uuid';

describe('PairsController', () => {
  let controller: PairsController;
  let service: PairsService;

  const mockPairsService = {
    findOrCreatePair: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PairsController],
      providers: [
        {
          provide: PairsService,
          useValue: mockPairsService,
        },
      ],
    }).compile();

    controller = module.get<PairsController>(PairsController);
    service = module.get<PairsService>(PairsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPair', () => {
    it('should return a pair response DTO', async () => {
      const id1 = uuidv4();
      const id2 = uuidv4();
      const userID = uuidv4();
      
      const mockPair: UserPair = {
        id: uuidv4(),
        id1,
        id2,
        userID,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserPair;

      const dto: CreatePairDto = { id1, id2 };

      jest.spyOn(service, 'findOrCreatePair').mockResolvedValue(mockPair);

      const result = await controller.createPair(dto);

      expect(result).toEqual({
        id1: mockPair.id1,
        id2: mockPair.id2,
        userID: mockPair.userID,
      });
      expect(service.findOrCreatePair).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all pairs', async () => {
      const mockPairs: UserPair[] = [
        {
          id: uuidv4(),
          id1: uuidv4(),
          id2: uuidv4(),
          userID: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as UserPair,
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockPairs);

      const result = await controller.findAll();

      expect(result).toEqual(mockPairs);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});