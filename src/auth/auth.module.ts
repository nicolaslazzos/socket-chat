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

@Module({
  controllers: [AuthController],
  providers: [{ provide: UserRepository.name, useClass: UserMongoRepository }, AuthService, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: `${process.env.JWT_SECRET}`, signOptions: { expiresIn: 3600 } }),
    MongooseModule.forFeature([UserModel]),
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule { }
