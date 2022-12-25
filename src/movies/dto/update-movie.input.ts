import { CreateMovieInput } from './create-movie.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMovieInput extends PartialType(CreateMovieInput) {
  @Field({ description: 'The UUID of the movie to update' })
  id: string;
}