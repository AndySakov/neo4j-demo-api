import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { Movie } from './entities/movie.entity';
import { MovieProperties } from './interfaces/movie-properties.interface';

@Injectable()
export class MoviesService {
  constructor(private readonly neo4jService: Neo4jService) { }

  create(createMovieInput: CreateMovieInput): Promise<MovieProperties> {
    return this.neo4jService.write(`
            CREATE (m:Movie {id: randomUUID() })
            SET m += $properties
            RETURN m
        `, { properties: createMovieInput })
      .then(res => new Movie(res.records[0].get('m')).toJson())
  }

  findAll(): Promise<MovieProperties[]> {
    return this.neo4jService.read(`
            MATCH (m:Movie)
            RETURN m
        `)
      .then(res => res.records.map((record) => new Movie(record.get('m')).toJson()))
  }

  findOne(id: string): Promise<MovieProperties | undefined> {
    return this.neo4jService.read(`
            MATCH (m:Movie {id: $id})
            RETURN m
        `, { id })
      .then(res => res.records.length ? new Movie(res.records[0].get('m')).toJson() : undefined)
  }

  update(updateMovieInput: UpdateMovieInput): Promise<MovieProperties> {
    const { id, ...properties } = updateMovieInput;
    return this.neo4jService.write(`
            MATCH (m:Movie {id: $id })
            SET m += $properties
            RETURN m
        `, { id: id, properties: properties })
      .then(res => new Movie(res.records[0].get('m')).toJson())
  }

  remove(id: string): Promise<boolean | undefined> {
    return this.neo4jService.write(`
            MATCH (m:Movie {id: $id})
            DETACH DELETE m
        `, { id })
      .then(res => res.records.length ? true : undefined)
  }
}
