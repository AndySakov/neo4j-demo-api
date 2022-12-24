import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Node } from 'neo4j-driver';
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

  toJson(): MovieProperties {
    return <Record<string, any>>this.node.properties as MovieProperties
  }
}
