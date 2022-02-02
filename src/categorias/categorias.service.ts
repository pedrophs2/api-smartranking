import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly jogadoresService: JogadoresService
    ){}

    public async listarCategorias(): Promise<Categoria[]> {
        return await this.categoriaModel.find().populate('jogadores').exec()
    }

    public async consultarCategoriaPorId(_id: string): Promise<Categoria> {
        const categoriaEncontrada = await this.categoriaModel.findById(_id).populate('jogadores').exec()

        if(!categoriaEncontrada)
            throw new NotFoundException('Nenhuma categoria encontrada')
        
        return categoriaEncontrada
    }

    public async consultarCategoriaPorTipo(categoria: string): Promise<Categoria> {
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).populate('jogadores').exec()

        if(!categoriaEncontrada)
            throw new NotFoundException('Nenhuma categoria encontrada')
        
        return categoriaEncontrada
    }

    public async criarCategoria(categoriaDto: CriarCategoriaDto): Promise<Categoria> {
        const { categoria } = categoriaDto
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec()

        if(categoriaEncontrada)
            throw new BadRequestException(`Categoria ${categoria} já cadastrada`)

        const categoriaCriada = new this.categoriaModel(categoriaDto)
        return await categoriaCriada.save()
    }

    public async atualizarCategoria(categoria: string, categoriaDto: AtualizarCategoriaDto): Promise<void> {
        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec()

        if(!categoriaEncontrada)
            throw new NotFoundException('Categoria não cadastrada')

        await this.categoriaModel.findOneAndUpdate({categoria}, {$set: categoriaDto}).exec()
    }

    public async adicionarJogador(categoria: string, jogadorId: any) {

        const categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec()
        const categoriaComJogador = await this.categoriaModel.find({categoria}).where('jogadores').in(jogadorId)
        
        if(!categoriaEncontrada)
            throw new BadRequestException('Categoria não cadastrada')

        if(categoriaComJogador.length > 0)
            throw new BadRequestException('Jogador já cadastrado na categoria')

        categoriaEncontrada.jogadores.push(jogadorId)
        await this.categoriaModel.findOneAndUpdate({categoria}, {$set: categoriaEncontrada})

    }

    public async consultarCategoriaJogador(jogadorId: any): Promise<Categoria> {
        const jogador = await this.jogadoresService.consultarJogadorPorId(jogadorId)

        if(!jogador)
            throw new BadRequestException('Nenhum jogador encontrado')

        return await this.categoriaModel.findOne().where('jogadores').in(jogadorId).populate('jogadores').exec()
    }

}
