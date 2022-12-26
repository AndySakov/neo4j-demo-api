import { Injectable } from '@nestjs/common';
import { Response } from './common/response.entity';

@Injectable()
export class AppService {
  healthCheck(): Response {
    return { success: true, message: 'Server is healthy and up!' };
  }
}
