import { Video } from "src/main/modules/domain/models/video.model";

export type VideoCreateDto = Omit<Video, "slug">;
