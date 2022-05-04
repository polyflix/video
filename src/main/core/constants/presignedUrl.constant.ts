/**
 * 3 hours expiry time
 */
export const PUT_PRESIGNED_URL_EXPIRY = 3 * 60 * 60;
/**
 * Expire doesn't need to be long, as if the client made a connection
 * then this one will never expire, until users closes their clients
 */
export const GET_PRESIGNED_URL_EXPIRY = 60 * 60 * 3;

export enum MINIO_BUCKETS {
    VIDEO = "videos",
    IMAGE = "images",
    SUBTITLE = "subtitles"
}
