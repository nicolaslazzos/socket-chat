import { Injectable, UnauthorizedException, Inject, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { UserRepository } from '../repositories/user.repository';
import { JwtPayload } from '../jwt-payload.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository.name) private readonly usersRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(dto: AuthCredentialsDto): Promise<User> {
    let user: User;

    try { user = await this.usersRepository.findByUsername(dto.username); } catch { }

    if (user) throw new ConflictException();

    try {
      const { username, password } = dto;

      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(password, salt);

      return this.usersRepository.create({ username, password: hashed });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async signIn(dto: AuthCredentialsDto): Promise<{ access_token: string; }> {
    const { username, password } = dto;

    const user = await this.usersRepository.findByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedException();

    const access_token: string = this.jwtService.sign({ username });

    return { access_token };
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;

    const user: User = await this.usersRepository.findByUsername(username);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
