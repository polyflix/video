import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  const port = config.get<number>("server.port", 3000);

  await app.listen(port, () => {
    console.log("Application started on port " + port);
  });
}

bootstrap();
