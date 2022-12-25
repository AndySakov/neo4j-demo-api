import { Module } from '@nestjs/common';
import { ProductionCompaniesService } from './production-companies.service';
import { ProductionCompaniesResolver } from './production-companies.resolver';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { UserService } from 'src/auth/user/user.service';
import { EncryptionService } from 'src/auth/encryption/encryption.service';

@Module({
  imports: [],
  providers: [ProductionCompaniesResolver, ProductionCompaniesService, JwtStrategy, EncryptionService, UserService,]
})
export class ProductionCompaniesModule { }
