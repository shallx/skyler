import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { SignUpDto } from './dto';
import { Prisma, User } from '@prisma/client';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  //JwtService is exported as JwtModule and imported as JwtService
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {} // Auto injected Globaly

  async login(dto: SignUpDto) {
    // Find user
    const user: User = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If email not found, throw exception
    if (!user) {
      throw new ForbiddenException("User doesn'nt Exist!");
    }

    // If password doesn't matches
    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials Incorrect');
    }
    delete user.password;
    return {
      ...user,
      accessToken: await this.signToken(user.id, user.email),
    };
  }

  async signup(dto: SignUpDto) {
    const pass = await hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: pass,
        },
      });
      delete user.password;
      return {
        ...user,
        accessToken: await this.signToken(user.id, user.email),
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log('THIS IS AN ERROR');
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw new HttpException('Something went wrong', 500);
    }
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15d',
      secret: this.config.get('JWT_SECRET'),
    });
    return token;
  }
}
