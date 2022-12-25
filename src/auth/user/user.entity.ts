import { Field, ObjectType } from '@nestjs/graphql'
import { Node } from 'neo4j-driver'
import { UserClaims } from '../interfaces/user-claims.interface'
import { UserProperties } from '../interfaces/user-properties.interface'
@ObjectType()
export class User {

    constructor(private readonly node: Node) { }

    @Field({ description: 'UUID of the record' })
    id: string;

    @Field({ description: 'First name of the user' })
    firstName: string;

    @Field({ description: 'Last name of the user' })
    lastName: string;

    @Field({ description: 'Email address of the user' })
    email: string;

    @Field({ description: 'Password of the user', nullable: true })
    password: string;

    @Field({ description: 'Auth token of the user when signed in', nullable: true })
    token: string;

    getId(): string {
        return (<Record<string, any>>this.node.properties).id
    }

    getPassword(): string {
        return (<Record<string, any>>this.node.properties).password
    }

    getClaims(): UserClaims {
        const { password, ...properties } = <Record<string, any>>this.node.properties

        return properties as UserClaims
    }

    toJson(): UserProperties {
        const { password, ...properties } = <Record<string, any>>this.node.properties;

        return properties as UserProperties
    }
}