import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { EncryptionService } from './encryption/encryption.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserService } from './user/user.service';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
                },
            })
        }),
    ],
    providers: [
        AuthResolver,
        EncryptionService,
        UserService,
        AuthService,
        LocalStrategy,
        JwtStrategy
    ],
})
export class AuthModule { }
