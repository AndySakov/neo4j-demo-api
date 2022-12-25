import { HttpException, HttpStatus, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { UserService } from "./user/user.service";
import { GqlAuthUser } from './decorators/user.decorator'
import { AuthenticatedUser } from "./interfaces/authenticated-user.interface";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "./user/user.entity";
import { GqlAuthGuard } from "./guards/gql.auth-guard";
import { AuthUserInput } from "./dto/auth-user.input";

@Resolver(() => User)
export class AuthResolver {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    @Mutation(() => User)
    async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<AuthenticatedUser> {
        const user_2 = await this.userService.create(createUserInput);
        return ({
            ...user_2.toJson(),
            token: this.authService.createToken(user_2),
        } as AuthenticatedUser);
    }

    @Mutation(() => User, { nullable: true })
    async authUser(@Args('authUserInput') authUserInput: AuthUserInput): Promise<AuthenticatedUser | null> {
        const { email, password } = authUserInput;
        const user = await this.authService.validateUser(email, password);

        if (user === undefined) {
            return null;
        } else {
            return {
                ...user.toJson(),
                token: this.authService.createToken(user),
            }
        }
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => User)
    async updateUser(@GqlAuthUser() user, @Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<AuthenticatedUser> {
        const updated = await this.userService.update(user.getId(), updateUserInput)

        return {
            ...updated.toJson(),
            token: this.authService.createToken(updated),
        }
    }

}
