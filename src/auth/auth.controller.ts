import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/signup')
  signUp(@Body() body: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(body);
  }

  @Post('/signin')
  signIn(@Body() body: AuthCredentialsDto): Promise<{ access_token: string; }> {
    return this.authService.signIn(body);
  }
}