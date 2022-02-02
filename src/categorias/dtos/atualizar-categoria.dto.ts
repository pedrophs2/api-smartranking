import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";
import { Evento } from "../interfaces/categoria.interface";

export class AtualizarCategoriaDto {

    @IsArray({message: 'Informe eventos válidos'})
    @ArrayMinSize(1, {message: 'Nenhum evento informado para cadastro'})
    eventos: Array<Evento>

    @IsString({message: 'Informe uma descrição válida'})
    @IsOptional()
    descricao: string

}