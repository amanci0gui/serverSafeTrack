import { CrimeType } from "@prisma/client";
import { User } from "src/user/entities/user.entity";
export class Marker {
    id: string;
    title: string;
    description: string;
    category: CrimeType;
    date: Date;
    time: Date;
    latitude: number;
    longitude: number;
    createdAt: Date;
    active: boolean;
    user: User;
} 

