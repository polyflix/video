import { Controller, Get, Param, Query } from "@nestjs/common";
import { VideoService } from "../services/video.service";
import { VideoParams } from "../filters/video.params";

@Controller("/api/videos")
export class CrudVideoController {
    constructor(private readonly videoService: VideoService) {}

    @Get()
    async findAll(@Query() query: VideoParams) {
        const { page, pageSize } = query;
        return await this.videoService.findAll(query);
    }

    @Get(":slug")
    async findOne(@Param("slug") slug: string) {
        return await this.videoService.findOne(slug);
    }
}
