import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModel } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { UserMongoRepository } from './repositories/user.mongo.repository';
import { AuthStrategy } from './constants';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: AuthStrategy.JWT }),
    JwtModule.registerAsync({ useFactory: () => ({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: 3600 } }) }),
    MongooseModule.forFeature([UserModel])
  ],
  providers: [
    { provide: UserRepository.name, useClass: UserMongoRepository },
    AuthService,
    JwtStrategy
  ],
  controllers: [AuthController],
  exports: [
    JwtStrategy,
    PassportModule,
    AuthService
  ],
})
export class AuthModule { }
