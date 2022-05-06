import { InvalidWatchedPercentError } from "../errors/invalidWatchedPercent.error";

export const MIN_PERCENT_DEFINE_WATCHED = 0.9;

export const defineIsWatched = (percent: number) => {
    if (percent > 1 || percent < 0) throw new InvalidWatchedPercentError();

    return percent >= MIN_PERCENT_DEFINE_WATCHED;
};
