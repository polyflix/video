export class PresignedUrlInvalidError extends Error {
    constructor(message?: string) {
        super(
            message ??
                `The presigned url is invalid. The title must be defined and the presigned url should not be completed to be valid.`
        );
    }
}
