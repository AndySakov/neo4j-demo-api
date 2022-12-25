import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesResolver } from './movies.resolver';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { UserService } from 'src/auth/user/user.service';
import { EncryptionService } from 'src/auth/encryption/encryption.service';

@Module({
  imports: [],
  providers: [MoviesResolver, MoviesService, JwtStrategy, EncryptionService, UserService,]
})
export class MoviesModule { }
