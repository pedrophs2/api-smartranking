import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty } from "class-validator";
import { Jogador } from "src/jogadores/interfaces/jogador.interface";

export class CriarDesafioDto {

    @IsNotEmpty({message: 'Informe uma data para realização da partida'})
    @IsDateString({message: 'Informe uma data válida'})
    dataHoraDesafio: Date

    @IsNotEmpty({message: 'Informe o identificador do jogador solicitante'})
    solicitante: Jogador

    @IsArray({message: 'Formato de jogadores inválidos'})
    @ArrayMinSize(2, {message: 'São necessário no mínimo 2 jogadores para um desafio'})
    @ArrayMaxSize(2, {message: 'São permitidos somente 2 jogadores por desafio'})
    jogadores: Array<Jogador>
}