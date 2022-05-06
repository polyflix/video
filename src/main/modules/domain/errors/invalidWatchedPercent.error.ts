export class InvalidWatchedPercentError extends Error {
    constructor(message?: string) {
        super(message ?? `Percent must be between 0 and 1`);
    }
}
