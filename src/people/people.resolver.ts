import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { PeopleService } from './people.service';
import { Person } from './entities/person.entity';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql.auth-guard';
import { PersonProperties } from './interfaces/person-properties.interface';
import { Response } from '../common/response.entity';
import { AddMovieDirectedInput } from './dto/add-movie-directed.input';
import { AddMovieStarredInInput } from './dto/add-movie-starred-in.input';
import { MovieProperties } from 'src/movies/interfaces/movie-properties.interface';

@Resolver(() => Person)
export class PeopleResolver {
  constructor(private readonly peopleService: PeopleService) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Person)
  createPerson(@Args('createPersonInput') createPersonInput: CreatePersonInput): Promise<PersonProperties> {
    return this.peopleService.create(createPersonInput).then((person) => person.toJson());
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Person], { name: 'people' })
  findAll(): Promise<PersonProperties[]> {
    return this.peopleService.findAll().then((people) => people.map((person) => person.toJson()));
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Person, { name: 'person' })
  findOne(@Args('id') id: string): Promise<PersonProperties | undefined> {
    return this.peopleService.findOne(id).then((person) => person.toJson());
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Person)
  updatePerson(@Args('updatePersonInput') updatePersonInput: UpdatePersonInput): Promise<PersonProperties> {
    return this.peopleService.update(updatePersonInput).then((person) => person.toJson());
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Response)
  removePerson(@Args('id') id: string): Promise<{ success: boolean, message: string }> {
    return this.peopleService.remove(id);
  }

  @ResolveField()
  moviesDirected(@Parent() person: Person): Promise<MovieProperties[]> {
    const { id } = person;
    return this.peopleService.getMoviesDirected(id).then((movies) => movies.map((movie) => movie.toJson()));
  }

  @ResolveField()
  moviesStarredIn(@Parent() person: Person): Promise<MovieProperties[]> {
    const { id } = person;
    return this.peopleService.getMoviesStarredIn(id).then((movies) => movies.map((movie) => movie.toJson()));
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Person)
  addMovieDirected(@Args('addMovieDirectedInput') addMovieDirectedInput: AddMovieDirectedInput): Promise<PersonProperties> {
    return this.peopleService.addMovieDirected(addMovieDirectedInput).then((person) => person.toJson());
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Person)
  addMovieStarredIn(@Args('addMovieStarredInInput') addMovieStarredInInput: AddMovieStarredInInput): Promise<PersonProperties> {
    return this.peopleService.addMovieStarredIn(addMovieStarredInInput).then((person) => person.toJson());
  }
}
