import { Module } from '@nestjs/common';
import { ProductionCompaniesService } from './production-companies.service';
import { ProductionCompaniesResolver } from './production-companies.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { UserService } from 'src/auth/user/user.service';
import { EncryptionService } from 'src/auth/encryption/encryption.service';

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
  providers: [ProductionCompaniesResolver, ProductionCompaniesService, JwtStrategy, EncryptionService, UserService,]
})
export class ProductionCompaniesModule { }
