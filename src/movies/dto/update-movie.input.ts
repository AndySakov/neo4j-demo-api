import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateMovieInput {
  @Field({ description: 'The UUID of the movie to update' })
  id: string;

  @Field({ description: 'Title of the movie' })
  title: string;

  @Field(() => Int, { description: 'Year of release' })
  released: number;

  @Field({ description: 'Popular phrase associated with this movie' })
  tagline: string;
}
