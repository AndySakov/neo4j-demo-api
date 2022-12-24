import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMovieInput {
  @Field({ description: 'Title of the movie' })
  title: string;

  @Field(() => Int, { description: 'Year of release' })
  released: number;

  @Field({ description: 'Popular phrase associated with this movie' })
  tagline: string;
}
