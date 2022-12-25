import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductionCompanyInput {
  @Field({ description: 'The name of the production company' })
  name: string;

  @Field(() => Int, { description: 'The year this production company was established' })
  established: number;
}
