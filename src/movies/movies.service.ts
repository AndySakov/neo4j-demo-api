import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { People } from 'src/common/common.types';
import { Person } from 'src/people/entities/person.entity';
import { ProductionCompany } from 'src/production-companies/entities/production-company.entity';
import { CreateMovieInput } from './dto/create-movie.input';
import { UpdateMovieInput } from './dto/update-movie.input';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(private readonly neo4jService: Neo4jService) { }

  create(createMovieInput: CreateMovieInput): Promise<Movie> {
    return this.neo4jService.write(`
            CREATE (m:Movie {id: randomUUID() })
            SET m += $properties
            RETURN m
        `, { properties: createMovieInput })
      .then(res => new Movie(res.records[0].get('m')))
  }

  findAll(): Promise<Movie[]> {
    return this.neo4jService.read(`
            MATCH (m:Movie)
            RETURN m
        `)
      .then(res => res.records.map((record) => new Movie(record.get('m'))))
  }

  findOne(id: string): Promise<Movie | undefined> {
    return this.neo4jService.read(`
            MATCH (m:Movie {id: $id})
            RETURN m
        `, { id })
      .then(res => res.records.length ? new Movie(res.records[0].get('m')) : undefined)
  }

  update(updateMovieInput: UpdateMovieInput): Promise<Movie> {
    const { id, ...properties } = updateMovieInput;
    return this.neo4jService.write(`
            MATCH (m:Movie {id: $id })
            SET m += $properties
            RETURN m
        `, { id, properties })
      .then(res => new Movie(res.records[0].get('m')))
  }

  remove(id: string): Promise<{ success: boolean, message: string }> {
    return this.neo4jService.write(`
            MATCH (m:Movie {id: $id})
            DETACH DELETE m
        `, { id })
      .then(res => res.records ? { success: true, message: `Record with id ${id} removed successfully` } : { success: false, message: `Record with id ${id} not found` })
  }

  getCast(id: string): Promise<People> {
    return this.neo4jService.read(`
            MATCH (p:Person) -[:ACTED_IN]-> (:Movie {id: $id})
            RETURN p
        `, { id })
      .then(res => res.records.map((record) => new Person(record.get('p'))))
  }

  getDirectors(id: string): Promise<People> {
    return this.neo4jService.read(`
            MATCH (p:Person) -[:DIRECTED]-> (:Movie {id: $id})
            RETURN p
        `, { id })
      .then(res => res.records.map((record) => new Person(record.get('p'))))
  }

  getProductionCompanies(id: string): Promise<ProductionCompany[]> {
    return this.neo4jService.read(`
            MATCH (pc:ProductionCompany) -[:PRODUCED]-> (:Movie {id: $id})
            RETURN pc
        `, { id })
      .then(res => res.records.map((record) => new ProductionCompany(record.get('pc'))))
  }
}
