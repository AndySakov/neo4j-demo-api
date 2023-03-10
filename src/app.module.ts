import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { PeopleModule } from './people/people.module';
import { ProductionCompaniesModule } from './production-companies/production-companies.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: process.env.NODE_ENV === "development",
      playground: true,
      autoSchemaFile: true,
      cors: {
        credentials: true,
        methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
        origin: process.env.ALLOWED_ORIGINS?.split(",") ?? [],
      },
    }),
    Neo4jModule.fromEnv(),
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
    AuthModule,
    MoviesModule,
    PeopleModule,
    ProductionCompaniesModule,
  ],
  providers: [AppResolver, AppService],
})
export class AppModule implements OnModuleInit {

  constructor(private readonly neo4jService: Neo4jService) { }

  onModuleInit() {
    return Promise.all([
      this.neo4jService.write('CREATE CONSTRAINT unique_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE').catch(e => { }),
      this.neo4jService.write('CREATE CONSTRAINT unique_email IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE').catch(e => { }),
    ])
  }
}
