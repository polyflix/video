import { Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Observable } from "rxjs";

export class PolyflixClientKafka extends ClientKafka {
    protected readonly logger = new Logger(this.constructor.name);
    override emit<TResult = any, TInput = any>(
        pattern: any,
        data: TInput
    ): Observable<TResult> {
        this.logger.log(`New message emited in kafka: ${data}`);
        return super.emit<TResult, TInput>(pattern, data);
    }
}
