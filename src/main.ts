import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    // Swagger
    const swaggerConfig = new DocumentBuilder()
        .setTitle("Ecommerce")
        .setDescription("API Ecommerce")
        .setVersion("1.0")
        .addCookieAuth("session", {
            type: "apiKey",
            in: "cookie",
        })
        .build();

    const documentFactory = () =>
        SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup("api", app, documentFactory);

    await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
