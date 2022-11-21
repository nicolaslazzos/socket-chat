import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
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
    return this.usersRepository.create(dto);
  }

  async signIn(dto: AuthCredentialsDto): Promise<{ access_token: string; }> {
    const { username, password } = dto;

    const user = await this.usersRepository.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const access_token: string = this.jwtService.sign({ username });

      return { access_token };
    }

    throw new UnauthorizedException();
  }

  async validateUser(token: string): Promise<User> {
    try {
      token = token.split(' ')[1];

      if (!token) throw new UnauthorizedException();

      const { username }: JwtPayload = this.jwtService.verify(token);

      return this.usersRepository.findByUsername(username);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
