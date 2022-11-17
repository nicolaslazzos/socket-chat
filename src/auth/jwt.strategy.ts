import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {
    super({ secretOrKey: `${process.env.JWT_SECRET}`, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;

    const user: User = await this.usersRepository.findByUsername(username);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
