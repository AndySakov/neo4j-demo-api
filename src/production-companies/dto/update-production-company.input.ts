import { CreateProductionCompanyInput } from './create-production-company.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductionCompanyInput extends PartialType(CreateProductionCompanyInput) {
  @Field({ description: 'UUID of the record' })
  id: string;
}
