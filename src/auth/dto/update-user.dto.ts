import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator'

export class UpdateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    firstName: string;

    @IsOptional()
    lastName: string;

}