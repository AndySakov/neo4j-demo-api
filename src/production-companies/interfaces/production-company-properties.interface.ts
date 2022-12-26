import { Movie } from "src/movies/entities/movie.entity";

export interface ProductionCompanyProperties {
    id: string
    name: string,
    established: number,
    productions?: Movie[],
}