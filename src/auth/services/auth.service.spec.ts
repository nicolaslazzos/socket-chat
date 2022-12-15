import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { JwtPayload } from '../jwt-payload.interface';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { accessTokenStub } from '../test/access-token.stub';
import { userStub } from '../test/user.stub';

jest.mock('../repositories/user.repository');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: UserRepository.name, useClass: UserRepository as any },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get<UserRepository>(UserRepository.name);
    jwtService = moduleRef.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('signUp', () => {
    describe('when sending a non-existing username', () => {
      it('should return the user created by the repository', async () => {
        jest.spyOn(userRepository, 'findByUsername').mockResolvedValueOnce(null);

        const user = userStub();

        const dto: AuthCredentialsDto = { username: 'some_non_existing_username', password: 'some_password' };

        const result = await authService.signUp(dto);

        expect(result).toEqual(user);
      });
    });

    describe('when sending an existing username', () => {
      it('should throw a conflict exception', async () => {
        const user = userStub();

        const dto: AuthCredentialsDto = { username: user.username, password: 'some_password' };

        const promise = authService.signUp(dto);

        expect(promise).rejects.toThrow(ConflictException);
      });
    });
  });

  describe('signIn', () => {
    beforeEach(() => {
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessTokenStub().access_token);
    });

    describe('when sending an existing username with a valid password', () => {
      it('should generate an access token', async () => {
        const user = userStub();

        const dto: AuthCredentialsDto = { username: user.username, password: 'some_password' };

        const result = await authService.signIn(dto);

        expect(result).toEqual(accessTokenStub());
      });
    });

    describe('when sending a non existing username', () => {
      it('should throw an unauthorized exception', async () => {
        jest.spyOn(userRepository, 'findByUsername').mockResolvedValueOnce(null);

        const dto: AuthCredentialsDto = { username: 'some_non_existing_username', password: 'some_password' };

        const promise = authService.signIn(dto);

        expect(promise).rejects.toThrow(UnauthorizedException);
      });
    });

    describe('when sending an existing username with an invalid password', () => {
      it('should throw an unauthorized exception', async () => {
        const user = userStub();

        const dto: AuthCredentialsDto = { username: user.username, password: 'some_invalid_password' };

        const promise = authService.signIn(dto);

        expect(promise).rejects.toThrow(UnauthorizedException);
      });
    });
  });

  describe('validate', () => {
    describe('when sending an existing username', () => {
      it('should return the user', async () => {
        const user = userStub();

        const payload: JwtPayload = { username: user.username };

        const result = await authService.validate(payload);

        expect(result).toEqual(user);
      });
    });

    describe('when sending an non-existing username', () => {
      it('should throw an unauthorized exception', async () => {
        jest.spyOn(userRepository, 'findByUsername').mockResolvedValueOnce(null);

        const payload: JwtPayload = { username: 'some_non_existing_username' };

        const promise = authService.validate(payload);

        expect(promise).rejects.toThrow(UnauthorizedException);
      });
    });
  });
});