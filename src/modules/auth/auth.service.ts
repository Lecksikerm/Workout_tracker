import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async signup(fullName: string, email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.usersService.create({
            fullName,
            email,
            password: hashedPassword,
        });

        return user;
    }


    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.signToken(user.id, user.email);
    }

    private signToken(userId: string, email: string) {
        return {
            access_token: this.jwtService.sign({
                sub: userId,
                email,
            }),
        };
    }
}

