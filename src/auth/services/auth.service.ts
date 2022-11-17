import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { UsersRepository } from '../repositories/users.repository';
import { JwtPayload } from '../jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(dto: AuthCredentialsDto): Promise<void> {
    await this.usersRepository.createUser(dto);
  }

  async signIn(dto: AuthCredentialsDto): Promise<{ access_token: string; }> {
    const { username, password } = dto;

    const user = await this.usersRepository.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const access_token: string = this.jwtService.sign(payload);

      return { access_token };
    }

    throw new UnauthorizedException();
  }
}
