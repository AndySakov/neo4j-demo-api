import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddMovieStarredInInput {
    @Field({ description: 'UUID of the person' })
    pid: string;

    @Field({ description: 'UUID of the movie' })
    mid: string;
}
