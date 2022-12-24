import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LocalAuthGuard } from "./guards/local.auth-guard";
import { JwtAuthGuard } from "./guards/jwt.auth-guard";
import { UserService } from "./user/user.service";
import { AuthUser } from './decorators/user.decorator'
import { AuthenticatedUser } from "./user/authenticated-user.interface";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Post('register')
    async postRegister(@Body() user: CreateUserDto): Promise<AuthenticatedUser> {
        const user_2 = await this.userService.create(user);
        return ({
            ...user_2.toJson(),
            token: this.authService.createToken(user_2),
        } as AuthenticatedUser);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async postLogin(@AuthUser() user): Promise<AuthenticatedUser> {
        return {
            ...user.toJson(),
            token: this.authService.createToken(user),
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('user')
    getUser(@AuthUser() user) {
        return {
            ...user.toJson(),
            token: this.authService.createToken(user),
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('user')
    async putUser(@AuthUser() user, @Body() properties: UpdateUserDto): Promise<AuthenticatedUser> {
        const updated = await this.userService.update(user.getId(), properties)

        return {
            ...updated.toJson(),
            token: this.authService.createToken(updated),
        }
    }

}
