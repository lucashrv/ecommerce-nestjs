import { applyDecorators } from "@nestjs/common";
import {
    ApiOperation,
    ApiTags,
    ApiBody,
    ApiResponse,
    ApiCookieAuth,
    ApiParam,
} from "@nestjs/swagger";
import { CreateUserDto } from "./../modules/user/dto/create-user.dto";

export function CreateUserDocs() {
    return applyDecorators(
        ApiTags("User"),
        ApiOperation({ summary: "Cria um novo usuário" }),
        ApiBody({
            type: CreateUserDto,
            examples: {
                example: {
                    value: {
                        name: "Seu nome",
                        email: "email@example.com",
                        password: "123456",
                        confirmPassword: "123456",
                    },
                },
            },
        }),
        ApiResponse({ status: 201, description: "Usuário criado com sucesso" }),
        ApiResponse({
            status: 400,
            description: "'Email já cadastrado' ou 'Senhas não correspondem'",
        }),
    );
}

export function FindAllUserDocs() {
    return applyDecorators(
        ApiCookieAuth(),
        ApiTags("User"),
        ApiOperation({ summary: "Lista todos usuários" }),
        ApiResponse({
            status: 200,
            description: "Retorna uma lista de usuários",
        }),
    );
}

export function FindOneUserDocs() {
    return applyDecorators(
        ApiCookieAuth(),
        ApiTags("User"),
        ApiOperation({ summary: "Busca usuário pelo ID" }),
        ApiParam({
            name: "id",
            required: true,
            description: "ID do usuário",
            type: String,
        }),
        ApiResponse({
            status: 200,
            description: "Retorna usuário buscado",
        }),
        ApiResponse({
            status: 404,
            description: "Usuário não encontrado",
        }),
    );
}
