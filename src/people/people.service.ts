import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Movie } from 'src/movies/entities/movie.entity';
import { AddMovieDirectedInput } from './dto/add-movie-directed.input';
import { AddMovieStarredInInput } from './dto/add-movie-starred-in.input';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { Person } from './entities/person.entity';

@Injectable()
export class PeopleService {
  constructor(private readonly neo4jService: Neo4jService) { }

  create(createPersonInput: CreatePersonInput): Promise<Person> {
    return this.neo4jService.write(`
            CREATE (p:Person {id: randomUUID() })
            SET p += $properties
            RETURN p
        `, { properties: createPersonInput })
      .then(res => new Person(res.records[0].get('p')))
  }

  findAll(): Promise<Person[]> {
    return this.neo4jService.read(`
            MATCH (p:Person)
            RETURN p
        `)
      .then(res => res.records.map((record) => new Person(record.get('p'))))
  }

  findOne(id: string): Promise<Person | undefined> {
    return this.neo4jService.read(`
            MATCH (p:Person {id: $id})
            RETURN p
        `, { id })
      .then(res => res.records.length ? new Person(res.records[0].get('p')) : undefined)
  }

  update(updatePersonInput: UpdatePersonInput): Promise<Person> {
    const { id, ...properties } = updatePersonInput;
    return this.neo4jService.write(`
            MATCH (p:Person {id: $id })
            SET p += $properties
            RETURN p
        `, { id, properties })
      .then(res => new Person(res.records[0].get('p')))
  }

  remove(id: string): Promise<{ success: boolean, message: string }> {
    return this.neo4jService.write(`
            MATCH (p:Person {id: $id})
            DETACH DELETE p
        `, { id })
      .then(res => res.records ? { success: true, message: `Record with id ${id} removed successfully` } : { success: false, message: `Record with id ${id} not found` })
  }

  getMoviesDirected(id: string): Promise<Movie[]> {
    return this.neo4jService.read(`
            MATCH (p:Person {id: $id}) -[:DIRECTED]-> (m:Movie)
            RETURN m
        `, { id })
      .then(res => res.records.map((record) => new Movie(record.get('m'))))
  }

  getMoviesStarredIn(id: string): Promise<Movie[]> {
    return this.neo4jService.read(`
            MATCH (p:Person {id: $id}) -[:ACTED_IN]-> (m:Movie)
            RETURN m
        `, { id })
      .then(res => res.records.map((record) => new Movie(record.get('m'))))
  }

  addMovieDirected(addMovieDirectedInput: AddMovieDirectedInput): Promise<Person> {
    const { pid, mid } = addMovieDirectedInput;
    return this.neo4jService.write(`
            MATCH (p:Person {id: $pid})
            MATCH (m:Movie {id: $mid})
            MERGE (p) -[:DIRECTED]-> (m)
            RETURN p
        `, { pid, mid })
      .then(res => new Person(res.records[0].get('p')))
  }

  addMovieStarredIn(addMovieStarredInInput: AddMovieStarredInInput): Promise<Person> {
    const { pid, mid } = addMovieStarredInInput;
    return this.neo4jService.write(`
            MATCH (p:Person {id: $pid})
            MATCH (m:Movie {id: $mid})
            MERGE (p) -[:ACTED_IN]-> (m)
            RETURN p
        `, { pid, mid })
      .then(res => new Person(res.records[0].get('p')))
  }
}
