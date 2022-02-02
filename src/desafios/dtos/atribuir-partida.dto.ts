import { IsNotEmpty } from "class-validator";
import { Jogador } from "src/jogadores/interfaces/jogador.interface";
import { Resultado } from "../interfaces/desafio.interface";

export class AtribuirPartidaDto {

    @IsNotEmpty({message: 'É necessário informar o vencedor da partida'})
    def: Jogador

    @IsNotEmpty({message: 'É necessário informar os resultados'})
    resultado: Array<Resultado>

}