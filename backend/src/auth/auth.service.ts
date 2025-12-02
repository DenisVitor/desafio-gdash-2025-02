import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !await bcrypt.compare(loginDto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }

  async verifyToken(token: string) {
    try {
      this.jwtService.verify(token);
      return { valid: true };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
