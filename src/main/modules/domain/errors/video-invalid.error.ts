export class VideoInvalidError extends Error {
    constructor(message?: string) {
        super(
            message ??
                `The video is invalid. The title must be defined and the todo should not be completed to be valid.`
        );
    }
}
