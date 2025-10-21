import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: "localhost",
            port: 5433,
            username: "postgres",
            password: "12345",
            database: "dev-ecommerce",
            autoLoadEntities: true,
            synchronize: false,
            migrations: ["dist/database/migrations/*.js"],
        }),
    ],
})
export class DatabaseModule {}
