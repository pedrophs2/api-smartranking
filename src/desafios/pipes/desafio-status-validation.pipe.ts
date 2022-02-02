import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { DesafioStatus } from "../interfaces/desafio-status.enum";

export class DesafioStatusValidationPipe implements PipeTransform {
    readonly statusPermitidos = [
        DesafioStatus.ACEITO,
        DesafioStatus.NEGADO,
        DesafioStatus.CANCELADO
    ]

    transform(value: any, metadata: ArgumentMetadata) {
        const status = value.status.toUpperCase()

        if(!this.statusValido(status))
            throw new BadRequestException(`${status} é inválido para esse desafio`)
        
        return value
    }    

    private statusValido(status: any) {
        const statusIndex = this.statusPermitidos.indexOf(status)
        return statusIndex !== -1
    }
}