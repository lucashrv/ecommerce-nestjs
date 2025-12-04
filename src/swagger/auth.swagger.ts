import { applyDecorators } from "@nestjs/common";
import {
    ApiOperation,
    ApiTags,
    ApiBody,
    ApiResponse,
    ApiCookieAuth,
} from "@nestjs/swagger";
import { CreateUserDto } from "./../modules/user/dto/create-user.dto";

export function LoginAuthDocs() {
    return applyDecorators(
        ApiTags("Auth"),
        ApiOperation({
            summary: "Efetua Login",
            description:
                "Valida as credenciais, depois cria uma sessão e um cookie-http-only",
        }),
        ApiBody({
            type: CreateUserDto,
            examples: {
                example: {
                    value: {
                        email: "email@email.com",
                        password: "123456",
                    },
                },
            },
        }),
        ApiResponse({ status: 200, description: "Usuário criado com sucesso" }),
        ApiResponse({
            status: 400,
            description: "E-mail ou senha incorretos",
        }),
        ApiResponse({
            status: 401,
            description: "Usuário desativado",
        }),
        ApiResponse({
            status: 400,
            description: "'Email já cadastrado' ou 'Senhas não correspondem'",
        }),
    );
}

export function LogoutAuthDocs() {
    return applyDecorators(
        ApiCookieAuth(),
        ApiTags("User"),
        ApiOperation({ summary: "Encerra a sessão atual" }),
        ApiResponse({
            status: 200,
            description: "Sessão encerrada",
        }),
        ApiResponse({
            status: 404,
            description: "Sessão não encontrada ou não existente",
        }),
    );
}

export function LogoutAllAuthDocs() {
    return applyDecorators(
        ApiCookieAuth(),
        ApiTags("User"),
        ApiOperation({
            summary: "Encerra todas as sessões vinculadas ao usuário",
        }),
        ApiResponse({
            status: 200,
            description: "Todas as sessões encerradas",
        }),
    );
}

export function MeAuthDocs() {
    return applyDecorators(
        ApiCookieAuth(),
        ApiTags("User"),
        ApiOperation({
            summary: "Retorna seu usuário logado",
        }),
        ApiResponse({
            status: 200,
            description: "Retorno o usuário logado",
        }),
        ApiResponse({
            status: 404,
            description: "Sessão não encontrada ou não existente",
        }),
    );
}
