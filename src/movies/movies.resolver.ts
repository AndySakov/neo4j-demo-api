import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql.auth-guard';
import { MovieProperties } from './interfaces/movie-properties.interface';

@Resolver(() => Movie)
export class MoviesResolver {
  constructor(private readonly moviesService: MoviesService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Movie)
  createMovie(@Args('createMovieInput') createMovieInput: CreateMovieInput): Promise<MovieProperties> {
    return this.moviesService.create(createMovieInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Movie], { name: 'movies' })
  findAll(): Promise<MovieProperties[]> {
    return this.moviesService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Movie, { name: 'movie' })
  findOne(@Args('id') id: string): Promise<MovieProperties | undefined> {
    return this.moviesService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Movie)
  updateMovie(@Args('updateMovieInput') updateMovieInput: UpdateMovieInput): Promise<MovieProperties> {
    return this.moviesService.update(updateMovieInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Movie)
  removeMovie(@Args('id') id: string): Promise<boolean | undefined> {
    return this.moviesService.remove(id);
  }
}
