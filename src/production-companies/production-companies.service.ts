import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreateProductionCompanyInput } from './dto/create-production-company.input';
import { UpdateProductionCompanyInput } from './dto/update-production-company.input';
import { ProductionCompany } from './entities/production-company.entity';

@Injectable()
export class ProductionCompaniesService {
  constructor(private readonly neo4jService: Neo4jService) { }

  create(createProductionCompanyInput: CreateProductionCompanyInput): Promise<ProductionCompany> {
    return this.neo4jService.write(`
            CREATE (pc:ProductionCompany {id: randomUUID() })
            SET pc += $properties
            RETURN pc
        `, { properties: createProductionCompanyInput })
      .then(res => new ProductionCompany(res.records[0].get('pc')))
  }

  findAll(): Promise<ProductionCompany[]> {
    return this.neo4jService.read(`
            MATCH (pc:ProductionCompany)
            RETURN pc
        `)
      .then(res => res.records.map((record) => new ProductionCompany(record.get('pc'))))
  }

  findOne(id: string): Promise<ProductionCompany | undefined> {
    return this.neo4jService.read(`
            MATCH (pc:ProductionCompany {id: $id})
            RETURN pc
        `, { id })
      .then(res => res.records.length ? new ProductionCompany(res.records[0].get('pc')) : undefined)
  }

  update(updateProductionCompanyInput: UpdateProductionCompanyInput): Promise<ProductionCompany> {
    const { id, ...properties } = updateProductionCompanyInput;
    return this.neo4jService.write(`
            MATCH (pc:ProductionCompany {id: $id })
            SET pc += $properties
            RETURN pc
        `, { id: id, properties: properties })
      .then(res => new ProductionCompany(res.records[0].get('pc')))
  }

  remove(id: string): Promise<{ success: boolean, message: string }> {
    return this.neo4jService.write(`
            MATCH (pc:ProductionCompany {id: $id})
            DETACH DELETE pc
        `, { id })
      .then(res => res.records ? { success: true, message: `Record with id ${id} removed successfully` } : { success: false, message: `Record with id ${id} not found` })
  }
}
