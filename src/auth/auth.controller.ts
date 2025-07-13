import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @Matches(/^\d{10}$/)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @MinLength(6)
  password: string;
}

class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @Matches(/^\d{10}$/)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @MinLength(6)
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
