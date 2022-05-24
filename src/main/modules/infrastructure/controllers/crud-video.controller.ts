import {
    Body,
    Controller,
    Delete,
    Get,
    ImATeapotException,
    Param,
    Post,
    Put,
    Query,
    UnauthorizedException
} from "@nestjs/common";
import { VideoService } from "../services/video.service";
import { VideoParams } from "../filters/video.params";
import { VideoApiMapper } from "../adapters/mappers/video.api.mapper";
import { Video, VideoSource } from "../../domain/models/video.model";
import {
    VideoPsuResponse,
    VideoResponse
} from "../../application/dto/video-response.dto";
import { VideoCreateDto } from "../../application/dto/video-create.dto";
import { youtube_v3 } from "googleapis";
import { TokenService } from "../services/token.service";
import { MeId, IsAdmin } from "@polyflix/x-utils";
import { PresignedUrlResponse } from "../../../core/types/presigned-url.type";
import { MINIO_BUCKETS } from "../../../core/constants/presignedUrl.constant";
import { PresignedUrl } from "../../domain/models/presigned-url.entity";
import { PresignedUrlApiMapper } from "../adapters/mappers/psu.api.mapper";
import { Paginate } from "src/main/core/types/pagination.dto";
import { VideoUpdateDto } from "../../application/dto/video-update.dto";

@Controller("videos")
export class CrudVideoController {
    constructor(
        private readonly videoService: VideoService,
        private readonly videoApiMapper: VideoApiMapper,
        private readonly presignedUrlApiMapper: PresignedUrlApiMapper,
        private readonly tokenService: TokenService
    ) {}

    @Post()
    async create(
        @Body() body: VideoCreateDto,
        @MeId() meId: string
    ): Promise<VideoResponse | (VideoResponse & VideoPsuResponse)> {
        const { thumbnailPutPsu, videoPutPsu, ...video } =
            await this.videoService.create(body, meId);

        const response = this.videoApiMapper.entityToApi(video as Video);

        if (thumbnailPutPsu) {
            (response as VideoPsuResponse).videoPutPsu =
                this.presignedUrlApiMapper.entityToApi(videoPutPsu);
        }
        if (videoPutPsu) {
            (response as VideoPsuResponse).thumbnailPutPsu =
                this.presignedUrlApiMapper.entityToApi(thumbnailPutPsu);
        }

        return response;
    }

    @Put(":slug")
    async update(
        @Body() body: VideoUpdateDto,
        @Param("slug") slug: string
    ): Promise<VideoResponse> {
        const video: Video = await this.videoService.update(slug, body);
        return this.videoApiMapper.entityToApi(video);
    }

    @Get()
    async findAll(
        @Query() query: VideoParams,
        @MeId() me: string,
        @IsAdmin() isAdmin: boolean
    ): Promise<Paginate<VideoResponse>> {
        const videos: Video[] = await this.videoService.findAll(
            query,
            me,
            isAdmin
        );
        return {
            items: this.videoApiMapper.entitiesToApis(videos),
            totalCount: await this.videoService.count(query)
        };
    }

    @Get(":slug")
    async findOne(
        @Param("slug") slug: string,
        @MeId() meId: string
    ): Promise<VideoResponse> {
        const video: Video = await this.videoService.findOne(slug, meId);
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
        @MeId() userId: string
    ): Promise<PresignedUrlResponse> {
        const video: Video = await this.videoService.findOne(slug, userId);

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

    @Delete(":id")
    async remove(@Param("id") id: string): Promise<void> {
        await this.videoService.delete(id);
    }
}
