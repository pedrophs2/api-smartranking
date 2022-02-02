import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {

    constructor(
        private readonly categoriasService: CategoriasService
    ){}

    @Get()
    public async listarCategorias(): Promise<Categoria[]> {
        return await this.categoriasService.listarCategorias()
    }

    @Get('/id/:_id')
    public async consultarCategoriaPorId(@Param('_id') _id: string): Promise<Categoria> {
        return await this.categoriasService.consultarCategoriaPorId(_id)
    }

    @Get('/categoria/:categoria')
    public async consultarCategoriaPorTipo(@Param('categoria') categoria: string): Promise<Categoria> {
        return await this.categoriasService.consultarCategoriaPorTipo(categoria)
    }

    @Get('/jogador/:_id')
    public async consultarCategoriaPorJogador(@Param('_id') jogadorId: string): Promise<Categoria> {
        return await this.categoriasService.consultarCategoriaJogador(jogadorId)
    }

    @Post()
    @UsePipes(ValidationPipe)
    public async criarCategoria(@Body() categoriaDto: CriarCategoriaDto): Promise<Categoria> {
        return await this.categoriasService.criarCategoria(categoriaDto)
    }

    @Put('/:categoria')
    @UsePipes(ValidationPipe)
    public async atualizarCategoria(
        @Param('categoria') categoria: string, 
        @Body() categoriaDto: AtualizarCategoriaDto
    ): Promise<void> {
        await this.categoriasService.atualizarCategoria(categoria, categoriaDto)
    }

    @Put('/:categoria/jogadores/:jogadorId')
    public async adicionarJogador(
        @Param('categoria') categoria: string, 
        @Param('jogadorId') jogadorId: string
    ): Promise<void>{
        await this.categoriasService.adicionarJogador(categoria, jogadorId)
    }


}
