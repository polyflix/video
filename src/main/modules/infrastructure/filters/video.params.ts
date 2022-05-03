import { Pagination } from "../../../core/types/pagination.type";

export const DefaultVideoParams: VideoParams = {
    page: 1,
    pageSize: 10
};

export class VideoParams extends Pagination {
    //todo add other filter param here
}
