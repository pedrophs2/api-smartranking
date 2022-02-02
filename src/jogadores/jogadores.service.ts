import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private jogadorModel: Model<Jogador>
  ){}

  public async listarJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec()
  }

  public async consultarJogadorPorEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec()

    if(!jogadorEncontrado) {
        throw new NotFoundException(`Nenhum jogador com email ${email} encontrado`)
    }

    return jogadorEncontrado
  }

  public async consultarJogadorPorId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findById(_id).exec()

    if(!jogadorEncontrado) {
        throw new NotFoundException(`Nenhum jogador com ID ${_id} encontrado`)
    }

    return jogadorEncontrado
  }

  public async criarJogador(jogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = jogadorDto;
    const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec()

    if (jogadorEncontrado)
      throw new BadRequestException('Email já cadastrado')
    
    const jogadorCriado = new this.jogadorModel(jogadorDto)
    return await jogadorCriado.save()
  }

  public async atualizarJogador(_id: string, jogadorDto: AtualizarJogadorDto): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findById({_id}).exec()

    if (!jogadorEncontrado)
      throw new NotFoundException('Jogador não cadastrado')
    
    return await this.jogadorModel.findByIdAndUpdate(_id, {$set: jogadorDto})
  }

  public async deletarJogador(_id: string): Promise<any> {
    const jogadorEncontrado = await this.jogadorModel.findById(_id).exec()

    if(!jogadorEncontrado)
      throw new NotFoundException('Jogador não cadastrado')

    return await this.jogadorModel.deleteOne({email: jogadorEncontrado.email}).exec()
  }
}
