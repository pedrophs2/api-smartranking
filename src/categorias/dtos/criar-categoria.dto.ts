import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";
import { Evento } from "../interfaces/categoria.interface";

export class CriarCategoriaDto {

    @IsString({message: 'Informe uma categoria válida'})
    @IsNotEmpty({message: 'A categoria deve ser informada'})
    readonly categoria: string

    @IsString({message: 'Informe uma descrição válida'})
    @IsNotEmpty({message: 'A descrição deve ser informada'})
    descricao: string

    @IsArray({message: 'Informe eventos válidos'})
    @ArrayMinSize(1, {message: 'Nenhum evento informado para cadastro'})
    eventos: Array<Evento>
}