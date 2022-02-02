import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Get()
  public async listarJogadores(): Promise<Jogador[]> {
    return await this.jogadoresService.listarJogadores()
  }

  @Get('/email/:email')
  public async buscarJogadorPorEmail(@Param('email', ValidacaoParametrosPipe) email: string) {
    return await this.jogadoresService.consultarJogadorPorEmail(email)
  }

  @Get('/id/:_id')
  public async buscarJogadorPorId(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    return await this.jogadoresService.consultarJogadorPorId(_id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async criarJogador(@Body() jogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadoresService.criarJogador(jogadorDto)
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  public async atualizarJogador(
    @Body() jogadorDto: AtualizarJogadorDto,
    @Param('_id', ValidacaoParametrosPipe) _id: string
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(_id, jogadorDto)
  }

  @Delete('/:_id')
  public async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    return await this.jogadoresService.deletarJogador(_id)
  }
}
