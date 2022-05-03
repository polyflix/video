import { Injectable } from "@nestjs/common";
import { has } from "lodash";
import { SelectQueryBuilder } from "typeorm";
import { VideoEntity } from "../adapters/repositories/entities/video.entity";
import {
    AbstractFilter,
    SortingTypeEnum
} from "../../../core/helpers/abstract.filter";
import { VideoParams } from "./video.params";

@Injectable()
export class VideoFilter extends AbstractFilter<VideoEntity> {
    buildFilters(
        queryBuilder: SelectQueryBuilder<VideoEntity>,
        params: VideoParams
    ): void {
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

        /*VideoFilter.buildVisibilityFilters(
            queryBuilder,
            Visibility.PUBLIC,
            false
        );*/
    }
    //todo uncomment visibility when column added to entity
    /*private static buildVisibilityFilters(
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
    }*/

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
            ["slug", "createdAt", "updatedAt", "views"]
        );
    }

    totalCount(
        queryBuilder: SelectQueryBuilder<VideoEntity>,
        params: VideoParams
    ): void {
        this.buildFilters(queryBuilder, params);
        queryBuilder.select("COUNT(DISTINCT video.slug) AS total");
    }
}
