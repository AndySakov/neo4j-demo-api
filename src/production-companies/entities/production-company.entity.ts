import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Node } from 'neo4j-driver';
import { Movie } from 'src/movies/entities/movie.entity';
import { ProductionCompanyProperties } from '../interfaces/production-company-properties.interface';

@ObjectType()
export class ProductionCompany {

  constructor(private readonly node: Node) { }

  @Field({ description: 'UUID of the record' })
  id: string;

  @Field({ description: 'The name of the production company' })
  name: string;

  @Field(() => Int, { description: 'The year this production company was established' })
  established: number;

  @Field(() => [Movie], { description: 'Movies produced by this production company', nullable: true })
  productions: Movie[];

  toJson(): ProductionCompanyProperties {
    return <Record<string, any>>this.node.properties as ProductionCompanyProperties
  }
}
