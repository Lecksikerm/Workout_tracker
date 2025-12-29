import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'john@example.com', description: 'Email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'strongPassword123', description: 'Password' })
    @IsNotEmpty()
    password: string;
}

