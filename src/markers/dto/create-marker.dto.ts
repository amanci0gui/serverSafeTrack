import { CrimeType } from "@prisma/client";
import { IsDate, IsEnum, IsNumber, IsString, MaxLength } from "class-validator";


export class CreateMarkerDto {
    @IsString()
    title: string;

    @IsString()
    @MaxLength(250)
    description: string;
    
    @IsEnum(CrimeType)
    category: CrimeType;

    @IsDate()
    date: Date;

    time: Date;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsNumber()
    userId: number;
}
