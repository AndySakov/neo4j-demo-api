import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Node } from 'neo4j-driver';
import { PersonProperties } from '../interfaces/person-properties.interface';

@ObjectType()
export class Person {

  constructor(private readonly node: Node) { }

  @Field({ description: 'UUID of the record' })
  id: string;

  @Field({ description: 'The persons first name' })
  firstName: string;

  @Field({ description: 'The persons last name' })
  lastName: string;

  @Field(() => Int, { description: 'The year this person was born' })
  birthYear: number;

  toJson(): PersonProperties {
    return <Record<string, any>>this.node.properties as PersonProperties
  }
}
