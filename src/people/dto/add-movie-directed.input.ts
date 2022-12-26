import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddMovieDirectedInput {
    @Field({ description: 'UUID of the person' })
    pid: string;

    @Field({ description: 'UUID of the movie' })
    mid: string;
}
