import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePersonInput {
  @Field({ description: 'First name of the person' })
  firstName: string;

  @Field({ description: 'Last name of the person' })
  lastName: string;

  @Field(() => Int, { description: 'The year the person was born' })
  birthYear: number;
}
