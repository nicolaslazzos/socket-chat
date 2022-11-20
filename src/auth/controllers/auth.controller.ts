import { Body, Controller, Post, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { User } from '../entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/signup')
  signUp(@Body() body: AuthCredentialsDto): Promise<User> {
    return this.authService.signUp(body);
  }

  @Post('/signin')
  signIn(@Body() body: AuthCredentialsDto): Promise<{ access_token: string; }> {
    return this.authService.signIn(body);
  }
}