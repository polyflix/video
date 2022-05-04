import { Option, Result } from "@swan-io/boxed";
import { Logger } from "@nestjs/common";
import { Like } from "../../models/like.model";

export abstract class LikeRepository {
    protected readonly logger = new Logger(this.constructor.name);

    abstract findOne(like: Like): Promise<Option<Like>>;

    abstract like(like: Like): Promise<Result<Like, Error>>;

    abstract unlike(like: Like): Promise<Result<Like, Error>>;
}
