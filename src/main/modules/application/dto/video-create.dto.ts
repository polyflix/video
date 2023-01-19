import { Visibility } from "../../infrastructure/adapters/repositories/entities/content.model";

export type VideoCreateDto = {
    title: string;

    description: string;

    thumbnail: string;

    visibility: Visibility;

    source: string;

    attachments?: string[]; // Optional list of attachments id
};
