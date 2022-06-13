import { Injectable } from "@nestjs/common";
import { has } from "lodash";
import { SelectQueryBuilder } from "typeorm";
import {
    AbstractFilter,
    SortingTypeEnum
} from "../../../core/helpers/abstract.filter";
import { Visibility } from "../adapters/repositories/entities/content.model";
import { VideoEntity } from "../adapters/repositories/entities/video.entity";
import { VideoParams } from "./video.params";

@Injectable()
export class VideoFilter extends AbstractFilter<VideoEntity> {
    buildFilters(
        queryBuilder: SelectQueryBuilder<VideoEntity>,
        params: VideoParams,
        me?: string,
        isAdmin?: boolean
    ): void {
        let isMe = false;
        const exact = true;

        if (has(params, "title")) {
            if (exact) {
                queryBuilder.andWhere("video.title = :title", {
                    title: params.title
                });
            } else {
                queryBuilder.andWhere("video.title like :title", {
                    title: `${params.title}%`
                });
            }
        }

        if (has(params, "authorId")) {
            isMe = me === params?.authorId;
            queryBuilder.andWhere("video.publisherId = :publisherId", {
                publisherId: params.authorId
            });
        }

        if (has(params, "minViews")) {
            queryBuilder.andWhere("video.views >= :minViews", {
                minViews: params.minViews
            });
        }

        if (has(params, "maxViews")) {
            queryBuilder.andWhere("video.views <= :maxViews", {
                maxViews: params.maxViews
            });
        }

        if (has(params, "slug")) {
            queryBuilder.andWhere("video.slug = :slug", { slug: params.slug });
        }

        if (me && (has(params, "isWatching") || has(params, "isWatched"))) {
            let userMetaCondition;

            if (has(params, "isWatched") && !has(params, "isWatching")) {
                userMetaCondition = "AND watchtime.isWatched = true ";
            } else if (has(params, "isWatching") && !has(params, "isWatched")) {
                userMetaCondition = "AND watchtime.isWatched = false ";
            }

            queryBuilder.innerJoinAndMapOne(
                "video.watchtime",
                "video.watchtimes",
                "watchtime",
                `watchtime.userId = :userId AND watchtime.videoId = video.id ${
                    userMetaCondition || ""
                }`,
                { userId: me }
            );

            queryBuilder.addGroupBy("video.id");
            queryBuilder.addGroupBy("video.slug");
            queryBuilder.addGroupBy("watchtime.userId");
            queryBuilder.addGroupBy("watchtime.videoId");
            queryBuilder.addGroupBy("publisher.userId");
        }

        if (isMe || isAdmin) {
            if (has(params, "visibility") || has(params, "draft")) {
                VideoFilter.buildVisibilityFilters(
                    queryBuilder,
                    params.visibility,
                    params.draft
                );
            }
        } else {
            VideoFilter.buildVisibilityFilters(
                queryBuilder,
                Visibility.PUBLIC,
                false
            );
        }
    }

    private static buildVisibilityFilters(
        queryBuilder: SelectQueryBuilder<VideoEntity>,
        visibility?: Visibility,
        draft?: boolean
    ) {
        if (visibility != null) {
            queryBuilder.andWhere("video.visibility = :visibility", {
                visibility
            });
        }
        if (draft != null) {
            queryBuilder.andWhere("video.draft = :draft", {
                draft
            });
        }
    }

    buildPaginationAndSort(
        queryBuilder: SelectQueryBuilder<VideoEntity>,
        params: VideoParams
    ): void {
        this.paginate(queryBuilder, params.page, params.pageSize);
        const joinCriterias = ["userMeta.updatedAt", "userMeta.createdAt"];

        if (has(params, "order")) {
            const cleanedOrder = params.order?.startsWith("-")
                ? params.order?.substring(1)
                : params.order;
            const ordering =
                params.order.substring(0, 1).replace(/\s/g, "") === "-"
                    ? SortingTypeEnum.DESC
                    : SortingTypeEnum.ASC;

            if (joinCriterias.indexOf(cleanedOrder) > -1) {
                queryBuilder.addOrderBy(cleanedOrder, ordering);
                // As we only have one order option for each request, we can return
                // so the below code won't be executed
                return;
            }
        }

        this.order(
            "video",
            queryBuilder,
            has(params, "order") ? params.order : "slug",
            ["slug", "createdAt", "updatedAt", "views", "likes"]
        );
    }

    buildWithUserMeta(
        queryBuilder: SelectQueryBuilder<VideoEntity>,
        userId: string
    ): void {
        queryBuilder.leftJoinAndMapOne(
            "video.watchtime",
            "video.watchtimes",
            "watchtime",
            "watchtime.userId = :userId",
            { userId: userId }
        );
    }

    totalCount(
        queryBuilder: SelectQueryBuilder<VideoEntity>,
        params: VideoParams,
        me?: string,
        isAdmin?: boolean
    ): void {
        this.buildFilters(queryBuilder, params, me, isAdmin);
        queryBuilder.select("COUNT(DISTINCT video.slug) AS total");
    }
}
