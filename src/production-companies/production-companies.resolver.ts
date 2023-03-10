import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ProductionCompaniesService } from './production-companies.service';
import { ProductionCompany } from './entities/production-company.entity';
import { CreateProductionCompanyInput } from './dto/create-production-company.input';
import { UpdateProductionCompanyInput } from './dto/update-production-company.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql.auth-guard';
import { ProductionCompanyProperties } from './interfaces/production-company-properties.interface';
import { Response } from '../common/response.entity';
import { AddProductionInput } from './dto/add-production.input';
import { MovieProperties } from 'src/movies/interfaces/movie-properties.interface';

@Resolver(() => ProductionCompany)
export class ProductionCompaniesResolver {
  constructor(private readonly productionCompaniesService: ProductionCompaniesService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductionCompany)
  createProductionCompany(@Args('createProductionCompanyInput') createProductionCompanyInput: CreateProductionCompanyInput): Promise<ProductionCompanyProperties> {
    return this.productionCompaniesService.create(createProductionCompanyInput).then((productionCompany) => productionCompany.toJson());
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ProductionCompany], { name: 'productionCompanies' })
  findAll(): Promise<ProductionCompanyProperties[]> {
    return this.productionCompaniesService.findAll().then((productionCompanies) => productionCompanies.map((productionCompany) => productionCompany.toJson()));
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ProductionCompany, { name: 'productionCompany' })
  findOne(@Args('id') id: string): Promise<ProductionCompanyProperties | undefined> {
    return this.productionCompaniesService.findOne(id).then((productionCompany) => productionCompany.toJson());
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductionCompany)
  updateProductionCompany(@Args('updateProductionCompanyInput') updateProductionCompanyInput: UpdateProductionCompanyInput): Promise<ProductionCompanyProperties> {
    return this.productionCompaniesService.update(updateProductionCompanyInput).then((productionCompany) => productionCompany.toJson());
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Response)
  removeProductionCompany(@Args('id') id: string): Promise<{ success: boolean, message: string }> {
    return this.productionCompaniesService.remove(id);
  }

  @ResolveField()
  productions(@Parent() productionCompany: ProductionCompany): Promise<MovieProperties[]> {
    const { id } = productionCompany;
    return this.productionCompaniesService.getProductions(id).then((movies) => movies.map((movie) => movie.toJson()));
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProductionCompany)
  addProduction(@Args('addProductionInput') addProductionInput: AddProductionInput): Promise<ProductionCompanyProperties> {
    return this.productionCompaniesService.addProduction(addProductionInput).then((productionCompany) => productionCompany.toJson());
  }
}
