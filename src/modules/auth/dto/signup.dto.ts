import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'strongPassword123', description: 'Password' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

