import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    ImATeapotException,
    Logger,
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
import { IsAdmin, MeId, MeRoles, Roles } from "@polyflix/x-utils";
import { PresignedUrlResponse } from "../../../core/types/presigned-url.type";
import { MINIO_BUCKETS } from "../../../core/constants/presignedUrl.constant";
import { PresignedUrl } from "../../domain/models/presigned-url.entity";
import { PresignedUrlApiMapper } from "../adapters/mappers/psu.api.mapper";
import { Paginate } from "src/main/core/types/pagination.dto";
import { VideoUpdateDto } from "../../application/dto/video-update.dto";
import { LikeService } from "../services/like.service";
import { Span } from "nestjs-otel";
import { Role } from "@polyflix/x-utils/dist/types/roles.enum";

@Controller("videos")
export class CrudVideoController {
    readonly logger = new Logger(CrudVideoController.name);
    constructor(
        private readonly videoService: VideoService,
        private readonly likeService: LikeService,
        private readonly videoApiMapper: VideoApiMapper,
        private readonly presignedUrlApiMapper: PresignedUrlApiMapper,
        private readonly tokenService: TokenService
    ) {}

    @Post()
    @Span("VIDEO_CONTROLLER_CREATE")
    @Roles(Role.Contributor, Role.Admin)
    async create(
        @Body() body: VideoCreateDto,
        @MeId() meId: string,
        @MeRoles() roles: string[]
    ): Promise<VideoResponse | (VideoResponse & VideoPsuResponse)> {
        if (!roles.includes(Role.Admin) && !roles.includes(Role.Contributor)) {
            throw new ForbiddenException(`You cannot create a video`);
        }

        const { thumbnailPutPsu, videoPutPsu, ...video } =
            await this.videoService.create(body, meId);

        const response = this.videoApiMapper.entityToApi(video as Video);

        if (videoPutPsu) {
            (response as VideoPsuResponse).videoPutPsu =
                this.presignedUrlApiMapper.entityToApi(videoPutPsu);
        }
        if (thumbnailPutPsu) {
            (response as VideoPsuResponse).thumbnailPutPsu =
                this.presignedUrlApiMapper.entityToApi(thumbnailPutPsu);
        }

        return response;
    }

    @Put(":slug")
    @Span("VIDEO_CONTROLLER_UPDATE_ONE")
    @Roles(Role.Admin, Role.Contributor)
    async update(
        @Body() body: VideoUpdateDto,
        @Param("slug") slug: string,
        @MeId() publisherId: string,
        @IsAdmin() isAdmin: boolean
    ): Promise<VideoResponse | (VideoResponse & VideoPsuResponse)> {
        const videoCheck: Video = await this.videoService.findOne(
            slug,
            publisherId
        );
        if (!isAdmin && videoCheck.publisher.id !== publisherId) {
            throw new ForbiddenException(`You cannot update this video`);
        }

        const { thumbnailPutPsu, ...video } = await this.videoService.update(
            slug,
            body
        );

        const response = this.videoApiMapper.entityToApi(video as Video);
        if (thumbnailPutPsu) {
            (response as VideoPsuResponse).thumbnailPutPsu =
                this.presignedUrlApiMapper.entityToApi(thumbnailPutPsu);
        }

        return response;
    }

    @Get()
    @Span("VIDEO_CONTROLLER_FIND_ALL")
    async findAll(
        @Query() query: VideoParams,
        @MeId() me: string
    ): Promise<Paginate<VideoResponse>> {
        const isAdminRequest = false;
        const videos: Video[] = await this.videoService.findAll(
            query,
            me,
            isAdminRequest
        );
        return {
            items: this.videoApiMapper.entitiesToApis(videos),
            totalCount: await this.videoService.count(query)
        };
    }

    @Get(":slug")
    @Span("VIDEO_CONTROLLER_FIND_ONE")
    async findOne(
        @Param("slug") slug: string,
        @IsAdmin() isAdmin: boolean,
        @MeId() userId: string
    ): Promise<VideoResponse> {
        const video: Video = await this.videoService.findOne(slug, userId);

        if (!isAdmin && Video.canAccessVideo(video, userId).isError()) {
            throw new UnauthorizedException(`You cannot access this video`);
        }

        const videoResponse: VideoResponse =
            this.videoApiMapper.entityToApi(video);
        videoResponse.isLiked = await this.likeService.isLiked(
            userId,
            video.id
        );
        return videoResponse;
    }

    /**
     * Find a video metadata with youtube unique video id.
     * @param {string} slug youtube video id
     */
    @Get("metadata/:slug")
    @Span("VIDEO_CONTROLLER_FIND_METAS")
    async findMetas(
        @Param("slug") slug: string
    ): Promise<youtube_v3.Schema$Video> {
        return this.videoService.findMetadata(slug);
    }

    @Get(":slug/token")
    @Span("VIDEO_CONTROLLER_VIDEO_PSU")
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

        return await this.tokenService.getPresignedUrl(
            MINIO_BUCKETS.VIDEO,
            video.source
        );
    }

    @Delete(":id")
    @Span("VIDEO_CONTROLLER_DELETE_ONE")
    async remove(
        @Param("id") id: string,
        @MeId() publisherId: string,
        @IsAdmin() isAdmin: boolean
    ): Promise<void> {
        const video: Video = await this.videoService.findOne(id, publisherId);
        if (!isAdmin && video.publisher.id !== publisherId) {
            throw new ForbiddenException(`You cannot delete this video`);
        }
        await this.videoService.delete(id);
    }
}
