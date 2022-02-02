import { Body, Controller, Delete, Get, NotImplementedException, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { AtribuirPartidaDto } from './dtos/atribuir-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidationPipe } from './pipes/desafio-status-validation.pipe';

@Controller('api/v1/desafios')
export class DesafiosController {

    constructor(
        private readonly desafiosService: DesafiosService
    ){}

    @Get()
    public async listarDesafios(): Promise<Desafio[]> {
        return await this.desafiosService.listarDesafios()
    }

    @Get('/jogador/:_id')
    public async consultarDesafiosJogador(@Param('_id') idJogador: any) {
        return await this.desafiosService.consultarDesafiosJogador(idJogador)
    }

    @Post()
    @UsePipes(ValidationPipe)
    public async criarDesafio(@Body() desafioDto: CriarDesafioDto): Promise<Desafio> {
        return await this.desafiosService.criarDesafio(desafioDto)
    }

    @Put('/:desafio')
    @UsePipes(ValidationPipe)
    public async atualizarDesafio(
        @Param('desafio') _id: string,
        @Body(DesafioStatusValidationPipe) desafioDto: AtualizarDesafioDto
    ): Promise<void> {
        await this.desafiosService.atualizarDesafio(_id, desafioDto)
    }

    @Post('/:desafio/partida')
    @UsePipes(ValidationPipe)
    public async atribuirDesafioPartida(
        @Param('desafio') _id: string,
        @Body() partidaDto: AtribuirPartidaDto
    ): Promise<void> {
        await this.desafiosService.atribuirPartida(_id, partidaDto)
    }

    @Delete('/:_id')
    public async deletarDesafio(@Param('_id') _id: string): Promise<void> {
        await this.desafiosService.deletarDesafio(_id)
    }

}
