import { Visibility } from "../../infrastructure/adapters/repositories/entities/content.model";

export type VideoUpdateDto = {
    slug: string;

    title: string;

    description: string;

    thumbnail: string;

    visibility: Visibility;

    draft: string;

    source: string;

    attachments?: string[]; // Optional list of attachments ids
};
