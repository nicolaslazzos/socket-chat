import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: AuthCredentialsDto): Promise<void> {
    const { username, password } = dto;

    try {
      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(password, salt);

      const user = this.usersRepository.create({ username, password: hashed });

      await this.usersRepository.save(user);
    } catch (e) {
      const errors = { 23505: 'A user with the same username already exists' };

      if (errors[e.code]) throw new ConflictException(errors[e.code]);

      throw new InternalServerErrorException();
    }
  }

  async signIn(dto: AuthCredentialsDto): Promise<{ access_token: string }> {
    const { username, password } = dto;

    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const access_token: string = this.jwtService.sign(payload);

      return { access_token };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
