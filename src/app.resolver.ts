import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import { Response } from './common/response.entity';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => Response)
  healthCheck(): Response {
    return this.appService.healthCheck();
  }
}
