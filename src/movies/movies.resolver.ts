import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql.auth-guard';
import { MovieProperties } from './interfaces/movie-properties.interface';
import { Response } from './entities/response.entity';

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
  removeMovie(@Args('id') id: string): Promise<{success: boolean, message: string}> {
    return this.moviesService.remove(id);
  }
}
