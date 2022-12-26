import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Node } from 'neo4j-driver';
import { People } from 'src/common/common.types';
import { Person } from 'src/people/entities/person.entity';
import { ProductionCompany } from 'src/production-companies/entities/production-company.entity';
import { MovieProperties } from '../interfaces/movie-properties.interface';

@ObjectType()
export class Movie {

  constructor(private readonly node: Node) { }

  @Field({ description: 'UUID of the record' })
  id: string;

  @Field({ description: 'Title of the movie' })
  title: string;

  @Field(() => Int, { description: 'Year of release' })
  released: number;

  @Field({ description: 'Popular phrase associated with this movie' })
  tagline: string;

  @Field(() => [Person], { description: 'Actors starring in this movie', nullable: true })
  cast: People;

  @Field(() => [Person], { description: 'Directors of this movie', nullable: true })
  directors: People;

  @Field(() => [ProductionCompany], { description: 'Production companies associated with this movie', nullable: true })
  producedBy: ProductionCompany[];

  toJson(): MovieProperties {
    return <Record<string, any>>this.node.properties as MovieProperties
  }
}
