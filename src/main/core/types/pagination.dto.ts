import { IsNumber, IsArray } from "class-validator";

export class Paginate<T> {
    @IsArray()
    items: T[];

    @IsNumber()
    totalCount: number;
}
