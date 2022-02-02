import { IsEmail, IsNotEmpty } from "class-validator"

export class CriarJogadorDto {
    @IsNotEmpty({message: 'É necessário informar um celular para cadastro'})
    readonly telefoneCelular: string
    @IsEmail({message: 'Informe um email válido'})
    readonly email: string
    @IsNotEmpty({message: 'É necessário informar um nome para cadastro'})
    readonly nome: string
}