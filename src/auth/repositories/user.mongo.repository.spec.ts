import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { userStub } from '../test/user.stub';
import { UserRepository } from './user.repository';
import { UserMongoRepository } from './user.mongo.repository';
import { User as UserModel } from '../models/user.model';
import { ModelMock } from '../../common/test/model.mock';

jest.mock('../models/user.model');

describe('UserMongoRepository', () => {
  let userRepository: UserRepository;
  let userModel: ModelMock<UserModel>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(UserModel.name), useClass: UserModel },
        { provide: UserRepository.name, useClass: UserMongoRepository },
      ],
    }).compile();

    userRepository = moduleRef.get<UserRepository>(UserRepository.name);
    userModel = moduleRef.get<ModelMock<UserModel>>(getModelToken(UserModel.name));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return the user created', async () => {
      const user = userStub();

      const dto: AuthCredentialsDto = { username: user.username, password: user.password };

      jest.spyOn(userModel, 'create');

      const result = await userRepository.create(dto);

      expect(result).toEqual(user);
      expect(userModel.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findByUsername', () => {
    it('should return the user with the specified username', async () => {
      const user = userStub();

      jest.spyOn(userModel, 'findOne');

      const result = await userRepository.findByUsername(user.username);

      expect(result).toEqual(user);
      expect(userModel.findOne).toHaveBeenCalledWith({ username: user.username });
    });
  });
});