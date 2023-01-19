import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Put,
    Query
} from "@nestjs/common";
import { MeId, Roles } from "@polyflix/x-utils";
import { Role } from "@polyflix/x-utils/dist/types/roles.enum";
import { Span } from "nestjs-otel";
import { Paginate } from "../../../../core/types/pagination.dto";
import { VideoResponse } from "../../../application/dto/video-response.dto";
import { VideoUpdateDto } from "../../../application/dto/video-update.dto";
import { Video } from "../../../domain/models/video.model";
import { VideoApiMapper } from "../../adapters/mappers/video.api.mapper";
import { VideoParams } from "../../filters/video.params";
import { VideoService } from "../../services/video.service";

@Controller("admin/videos")
@Roles(Role.Admin)
export class AdminVideoController {
    readonly logger = new Logger(this.constructor.name);
    constructor(
        private readonly videoService: VideoService,
        private readonly videoApiMapper: VideoApiMapper
    ) {}

    @Get()
    @Span("VIDEO_ADMIN_CONTROLLER_FIND_ALL")
    async findAll(
        @Query() query: VideoParams,
        @MeId() me: string
    ): Promise<Paginate<VideoResponse>> {
        const isAdminRequest = true;
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
    async findOne(@Param("slug") slug: string): Promise<VideoResponse> {
        const video: Video = await this.videoService.findOne(slug);
        return this.videoApiMapper.entityToApi(video);
    }

    @Delete(":id")
    @Span("VIDEO_ADMIN_DElETE_ONE")
    async deleteVideo(@Param("id") id: string): Promise<void> {
        await this.videoService.delete(id);
    }

    @Put(":slug")
    @Span("VIDEO_ADMIN_CONTROLLER_UPDATE_ONE")
    async updateVideo(
        @Body() updateDto: VideoUpdateDto,
        @Param("slug") slug: string
    ): Promise<VideoResponse> {
        const updated_video = await this.videoService.update(slug, updateDto);
        return this.videoApiMapper.entityToApi(updated_video);
    }

    @Put(":slug/visibility")
    @Span("VIDEO_ADMIN_CONTROLLER_UPDATE_VISIBILITY")
    async updateVideoVisibility(
        @Param("slug") slug: string,
        @Body() dto: Pick<VideoUpdateDto, "visibility">
    ): Promise<VideoResponse> {
        const update_payload: Partial<VideoUpdateDto> = {
            visibility: dto.visibility
        };
        const updated_video = await this.videoService.update(
            slug,
            update_payload
        );
        return this.videoApiMapper.entityToApi(updated_video);
    }
}
