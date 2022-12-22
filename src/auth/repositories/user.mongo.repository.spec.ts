import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { userStub } from '../test/user.stub';
import { UserRepository } from './user.repository';
import { UserMongoRepository } from './user.mongo.repository';
import { User as UserModel } from '../models/user.model';

jest.mock('../models/user.model')

describe('UserMongoRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(UserModel.name), useClass: UserModel },
        { provide: UserRepository.name, useClass: UserMongoRepository },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository.name);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return the user created', async () => {
      const user = userStub();

      const dto: AuthCredentialsDto = { username: user.username, password: user.password };

      const result = await userRepository.create(dto);

      expect(result).toEqual(user);
    });
  });

  describe('findByUsername', () => {
    it('should return the user with the specified username', async () => {
      const user = userStub();

      const result = await userRepository.findByUsername(user.username);

      expect(result).toEqual(user);
    });
  });
});