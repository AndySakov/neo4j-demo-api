import { NestFactory } from '@nestjs/core';
import { Neo4jErrorFilter } from 'nest-neo4j/dist';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new Neo4jErrorFilter)
  app.use(helmet())
  app.enableCors({
    credentials: true,
    methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
    origin: process.env.ALLOWED_ORIGINS?.split(",") ?? [],
  })
  await app.listen(3000);
}
bootstrap();
