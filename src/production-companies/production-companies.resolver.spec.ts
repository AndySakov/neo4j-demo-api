import { Test, TestingModule } from '@nestjs/testing';
import { ProductionCompaniesResolver } from './production-companies.resolver';
import { ProductionCompaniesService } from './production-companies.service';

describe('ProductionCompaniesResolver', () => {
  let resolver: ProductionCompaniesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductionCompaniesResolver, ProductionCompaniesService],
    }).compile();

    resolver = module.get<ProductionCompaniesResolver>(ProductionCompaniesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
