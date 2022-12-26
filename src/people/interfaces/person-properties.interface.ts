import { Movie } from "src/movies/entities/movie.entity"

export interface PersonProperties {
    id: string
    firstName: string,
    lastName: string,
    birthYear: number,
    moviesDirected?: Movie[],
    moviesStarredIn?: Movie[],
}