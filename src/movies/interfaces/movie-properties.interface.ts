import { People } from "src/common/common.types"
import { ProductionCompany } from "src/production-companies/entities/production-company.entity"

export interface MovieProperties {
    id: string
    title: string,
    released: number,
    tagline: string,
    cast?: People,
    directors?: People,
    producedBy?: ProductionCompany[],
}