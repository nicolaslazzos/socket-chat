import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Socket } from 'socket.io';
import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { AuthStrategy } from './constants';

const jwtFromRequest = (req: Socket | Request): string => {
  let authorization: string | null = null;

  if (req instanceof Socket) authorization = req.handshake.headers.authorization;
  else authorization = req.headers.authorization;

  return authorization ? authorization.replace('Bearer ', '') : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategy.JWT) {
  constructor(private readonly authService: AuthService) {
    super({ secretOrKey: process.env.JWT_SECRET, jwtFromRequest, ignoreExpiration: true });
  }

  async validate(payload: JwtPayload): Promise<User> {
    return this.authService.validate(payload);
  }
}
