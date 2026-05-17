import { IsString, IsOptional } from "class-validator";

export class InitialDto {
    @IsString()
    city_id!: string;

    @IsString()
    country!: string;

    @IsString()
    province!: string;

    @IsString()
    district!: string;

    @IsString()
    city!: string;
}