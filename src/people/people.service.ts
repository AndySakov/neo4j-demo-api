import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
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
        `, { id: id, properties: properties })
      .then(res => new Person(res.records[0].get('p')))
  }

  remove(id: string): Promise<{ success: boolean, message: string }> {
    return this.neo4jService.write(`
            MATCH (p:Person {id: $id})
            DETACH DELETE p
        `, { id })
      .then(res => res.records ? { success: true, message: `Record with id ${id} removed successfully` } : { success: false, message: `Record with id ${id} not found` })
  }
}
