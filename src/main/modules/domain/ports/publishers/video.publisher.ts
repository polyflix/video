import { TriggerType } from "@polyflix/x-utils";
import { Video } from "../../models/video.model";

export abstract class VideoPublisher {
    protected abstract tryPublishMessage(trigger: TriggerType, payload: Video);

    abstract publishVideoUpdate(video: Video);
    abstract publishVideoDelete(video: Video);
    abstract publishVideoCreate(video: Video);
}
