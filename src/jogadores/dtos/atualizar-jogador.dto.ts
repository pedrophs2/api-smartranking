import { IsEmail, IsNotEmpty } from "class-validator"

export class AtualizarJogadorDto {
    @IsNotEmpty({message: 'É necessário informar um celular para cadastro'})
    readonly telefoneCelular: string
    @IsNotEmpty({message: 'É necessário informar um nome para cadastro'})
    readonly nome: string
}