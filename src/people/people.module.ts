import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleResolver } from './people.resolver';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { UserService } from 'src/auth/user/user.service';
import { EncryptionService } from 'src/auth/encryption/encryption.service';

@Module({
  imports: [],
  providers: [PeopleResolver, PeopleService, JwtStrategy, EncryptionService, UserService,]
})
export class PeopleModule { }
