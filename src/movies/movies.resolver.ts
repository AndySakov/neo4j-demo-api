import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql.auth-guard';
import { MovieProperties } from './interfaces/movie-properties.interface';
import { Response } from '../common/response.entity';
import { ProductionCompanyProperties } from 'src/production-companies/interfaces/production-company-properties.interface';
import { PersonProperties } from 'src/people/interfaces/person-properties.interface';

@Resolver(() => Movie)
export class MoviesResolver {
  constructor(private readonly moviesService: MoviesService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Movie)
  createMovie(@Args('createMovieInput') createMovieInput: CreateMovieInput): Promise<MovieProperties> {
    return this.moviesService.create(createMovieInput).then((movie) => movie.toJson());
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Movie], { name: 'movies' })
  findAll(): Promise<MovieProperties[]> {
    return this.moviesService.findAll().then((movies) => movies.map((movie) => movie.toJson()));
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Movie, { name: 'movie' })
  findOne(@Args('id') id: string): Promise<MovieProperties | undefined> {
    return this.moviesService.findOne(id).then((movie) => movie.toJson());
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Movie)
  updateMovie(@Args('updateMovieInput') updateMovieInput: UpdateMovieInput): Promise<MovieProperties> {
    return this.moviesService.update(updateMovieInput).then((movie) => movie.toJson());
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Response)
  removeMovie(@Args('id') id: string): Promise<{ success: boolean, message: string }> {
    return this.moviesService.remove(id);
  }

  @ResolveField()
  cast(@Parent() movie: Movie): Promise<PersonProperties[]> {
    const { id } = movie;
    return this.moviesService.getCast(id).then((cast) => cast.map((member) => member.toJson()));;
  }

  @ResolveField()
  directors(@Parent() movie: Movie): Promise<PersonProperties[]> {
    const { id } = movie;
    return this.moviesService.getDirectors(id).then((directors) => directors.map((director) => director.toJson()));;
  }

  @ResolveField()
  producedBy(@Parent() movie: Movie): Promise<ProductionCompanyProperties[]> {
    const { id } = movie;
    return this.moviesService.getProductionCompanies(id).then((companies) => companies.map((company) => company.toJson()));;
  }
}
