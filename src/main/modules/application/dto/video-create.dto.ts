import { Visibility } from "../../infrastructure/adapters/repositories/entities/content.model";

export type VideoCreateDto = {
    title: string;

    description: string;

    thumbnail: string;

    visibility: Visibility;

    draft: boolean;

    source: string;
};
