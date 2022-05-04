import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { VideoService } from "../services/video.service";
import { VideoParams } from "../filters/video.params";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { Video } from "../../domain/models/video.model";
import { VideoResponse } from "../../application/dto/video-response.dto";
import { VideoCreateDto } from "../../application/dto/video-create.dto";

@Controller("video")
export class CrudVideoController {
    constructor(
        private readonly videoService: VideoService,
        private readonly videoApiMapper: VideoApiMapper
    ) {}

    @Post()
    async create(@Body() body: VideoCreateDto): Promise<VideoResponse> {
        const video = await this.videoService.create(body);
        return this.videoApiMapper.entityToApi(video);
    }

    @Get()
    async findAll(@Query() query: VideoParams): Promise<VideoResponse[]> {
        const videos: Video[] = await this.videoService.findAll(query);
        return this.videoApiMapper.entitiesToApis(videos);
    }

    @Get(":slug")
    async findOne(@Param("slug") slug: string): Promise<VideoResponse> {
        const video: Video = await this.videoService.findOne(slug);
        return this.videoApiMapper.entityToApi(video);
    }
}
