import { Module } from "@nestjs/common";
import { UserModule } from "./modules/user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./modules/auth/guards/roles.guard";

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
    providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
