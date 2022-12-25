import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PeopleService } from './people.service';
import { Person } from './entities/person.entity';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql.auth-guard';
import { PersonProperties } from './interfaces/person-properties.interface';
import { Response } from '../common/response.entity';

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
}
