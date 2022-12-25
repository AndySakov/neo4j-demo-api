import { CreatePersonInput } from './create-person.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePersonInput extends PartialType(CreatePersonInput) {
  @Field({ description: 'The UUID of the person to update' })
  id: string;
}
