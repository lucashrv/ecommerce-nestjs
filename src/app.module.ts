import { Module } from "@nestjs/common";
import { UserModule } from "./modules/user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        PrismaModule,
        UserModule,
        AuthModule,
    ],
})
export class AppModule {}
