import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
