import {
    Body,
    Controller,
    Get,
    ImATeapotException,
    Param,
    Post,
    Query,
    UnauthorizedException
} from "@nestjs/common";
import { VideoService } from "../services/video.service";
import { VideoParams } from "../filters/video.params";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { Video, VideoSource } from "../../domain/models/video.model";
import { VideoResponse } from "../../application/dto/video-response.dto";
import { VideoCreateDto } from "../../application/dto/video-create.dto";
import { youtube_v3 } from "googleapis";
import { TokenService } from "../services/token.service";
import { MeId, IsAdmin } from "@polyflix/x-utils";
import { PresignedUrlResponse } from "../../../core/types/presigned-url.type";
import { MINIO_BUCKETS } from "../../../core/constants/presignedUrl.constant";
import { PresignedUrl } from "../../domain/models/presigned-url.entity";

@Controller("video")
export class CrudVideoController {
    constructor(
        private readonly videoService: VideoService,
        private readonly videoApiMapper: VideoApiMapper,
        private readonly tokenService: TokenService
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

    /**
     * Find a video metadata with youtube unique video id.
     * @param {string} slug youtube video id
     */
    @Get("metadata/:slug")
    async findMetas(
        @Param("slug") slug: string
    ): Promise<youtube_v3.Schema$Video> {
        return this.videoService.findMetadata(slug);
    }

    @Get(":slug/token")
    async videoPSU(
        @Param("slug") slug: string,
        @IsAdmin() isAdmin: boolean,
        @MeId("userID") userId: string
    ): Promise<PresignedUrlResponse> {
        const video: Video = await this.videoService.findOne(slug);

        if (video.sourceType !== VideoSource.INTERNAL)
            throw new ImATeapotException(
                "Cannot get a token from an external video"
            );

        if (!isAdmin && Video.canAccessVideo(video, userId).isError()) {
            throw new UnauthorizedException(`You cannot access this video`);
        }
        if (PresignedUrl.canGenerateVideoToken(video).isError()) {
            throw new UnauthorizedException(
                `You cannot create a token for this video`
            );
        }

        // TODO Alex you need to explain me this fuck
        // const access = await this.videoService.canAccessVideo(video, userId);
        // if (access.isError()) {
        //     throw new UnprocessableEntityException(access.getError().message);
        // }

        return await this.tokenService.getPresignedUrl(
            MINIO_BUCKETS.VIDEO,
            video.source
        );
    }
}
