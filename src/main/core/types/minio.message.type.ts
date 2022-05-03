interface UserIdentity {
    principalId: string;
}

interface RequestParameters {
    accessKey: string;
    region: string;
    sourceIPAddress: string;
}

interface ResponseElements {
    "x-amz-request-id": string;
    "x-minio-deployment-id": string;
    "x-minio-origin-endpoint": string;
}

interface OwnerIdentity {
    principalId: string;
}

interface Bucket {
    name: string;
    ownerIdentity: OwnerIdentity;
    arn: string;
}

interface UserMetadata {
    "content-type": string;
}

interface MinIOObject {
    key: string;
    size: number;
    eTag: string;
    contentType: string;
    userMetadata: UserMetadata;
    versionId: string;
    sequencer: string;
}

interface S3 {
    s3SchemaVersion: string;
    configurationId: string;
    bucket: Bucket;
    object: MinIOObject;
}

interface Source {
    host: string;
    port: string;
    userAgent: string;
}

interface Record {
    eventVersion: string;
    eventSource: string;
    awsRegion: string;
    eventTime: Date;
    eventName: string;
    userIdentity: UserIdentity;
    requestParameters: RequestParameters;
    responseElements: ResponseElements;
    s3: S3;
    source: Source;
}

interface MinIoMessageValue {
    EventName: string;
    Key: string;
    Records: Record[];
}
interface BatchContext {
    firstOffset: string;
    firstTimestamp: string;
    partitionLeaderEpoch: number;
    inTransaction: boolean;
    isControlBatch: boolean;
    lastOffsetDelta: number;
    producerId: string;
    producerEpoch: number;
    firstSequence: number;
    maxTimestamp: string;
    timestampType: number;
    magicByte: number;
}

export interface MinIoMessage {
    magicByte: number;
    attributes: number;
    timestamp: string;
    offset: string;
    key: string;
    value: MinIoMessageValue;
    headers: any;
    isControlRecord: boolean;
    batchContext: BatchContext;
    topic: string;
    partition: number;
}
