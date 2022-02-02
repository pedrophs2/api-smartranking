import { BadRequestException, Injectable, InternalServerErrorException, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtribuirPartidaDto } from './dtos/atribuir-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio, Partida } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {

    constructor(
        @InjectModel('Desafio')
        private readonly desafioModel: Model<Desafio>,

        @InjectModel('Partida')
        private readonly partidaModel: Model<Partida>,
        private readonly categoriasService: CategoriasService,
        private readonly jogadoresService: JogadoresService
    ){}

    public async listarDesafios(): Promise<Desafio[]> {
        return await this.desafioModel.find()
            .populate('solicitante')
            .populate('jogadores')
            .populate('partida')
            .exec()
    }

    public async criarDesafio(desafioDto: CriarDesafioDto): Promise<Desafio> {
        const jogadores = await this.jogadoresService.listarJogadores()
        desafioDto.jogadores.map(jogadorDto => {
            const jogadorFilter = jogadores.filter(jogador => jogador._id == jogadorDto._id)

            if(jogadorFilter.length == 0)
                throw new BadRequestException(`O ID ${jogadorDto._id} não é de um jogador válido`)
        })

        const jogadorSolicitante = await desafioDto.jogadores.filter(jogador => jogador._id === desafioDto.solicitante)

        if(jogadorSolicitante.length == 0)
            throw new BadRequestException('O jogador solicitante deve ser um dos participantes')

        const categoriaJogador = await this.categoriasService.consultarCategoriaJogador(desafioDto.solicitante)

        if(!categoriaJogador)
            throw new BadRequestException('O jogador deve estar cadastrado em alguma categoria para desafiar')

        const desafioCriado = new this.desafioModel(desafioDto)
        desafioCriado.categoria = categoriaJogador.categoria
        desafioCriado.dataHoraSolicitacao = new Date()
        desafioCriado.status = DesafioStatus.PENDENTE

        return await desafioCriado.save()
    }

    public async consultarDesafiosJogador(idJogador: any): Promise<Desafio[]> {
        const jogadores = await this.jogadoresService.listarJogadores()
        const jogadorFilter = jogadores.filter(jogador => jogador._id == idJogador)

        if(jogadorFilter.length == 0)
            throw new BadRequestException(`O ID ${idJogador} não é de um jogador válido`)

        return await this.desafioModel.find().where('jogadores').in(idJogador)
            .populate('solicitante')
            .populate('jogadores')
            .populate('partida')
            .exec()
    }

    public async atualizarDesafio(_id: string, desafioDto: AtualizarDesafioDto): Promise<void> {
        const desafioEncontrado = await this.desafioModel.findById(_id).exec()

        if(!desafioEncontrado)
            throw new BadRequestException('Desafio não encontrado')
        
        if(desafioDto.status)
            desafioEncontrado.dataHoraResposta = new Date()

        desafioEncontrado.status = desafioDto.status
        desafioEncontrado.dataHoraDesafio = desafioDto.dataHoraDesafio

        await this.desafioModel.findOneAndUpdate({_id}, {$set: desafioEncontrado}).exec()
    }

    public async atribuirPartida(_id: string, partidaDto: AtribuirPartidaDto): Promise<void> {
        const desafio = await this.desafioModel.findById(_id).exec()

        if(!desafio)
            throw new BadRequestException('Desafio não encontrado')

        const jogadorFilter = desafio.jogadores.filter(jogador => jogador._id == partidaDto.def)

        if(jogadorFilter.length == 0)
            throw new BadRequestException('O jogador não faz parte do desafio')

        const partida = new this.partidaModel(partidaDto)
        partida.categoria = desafio.categoria
        partida.jogadores = desafio.jogadores

        const resultado = await partida.save()
        
        desafio.status = DesafioStatus.REALIZADO
        desafio.partida = resultado._id
        
        try {
            await this.desafioModel.findOneAndUpdate({_id}, {$set: desafio}).exec()
        } catch(error) {
            await this.partidaModel.deleteOne({_id: resultado._id}).exec()
            throw new InternalServerErrorException('Erro ao finalizar a partida, tente novamente por favor')
        }
    }

    public async deletarDesafio(_id: string): Promise<void> {
        const desafio = await this.desafioModel.findById(_id).exec()

        if(!desafio)
            throw new BadRequestException('Nenhum desafio encontrado')

        desafio.status = DesafioStatus.CANCELADO
        this.desafioModel.findByIdAndUpdate(_id, {$set: desafio}).exec()
    }
}
