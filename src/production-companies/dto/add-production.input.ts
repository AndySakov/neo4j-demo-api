import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddProductionInput {
    @Field({ description: 'UUID of the production company' })
    pcid: string;

    @Field({ description: 'UUID of the movie' })
    mid: string;
}
