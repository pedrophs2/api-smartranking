import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ValidacaoParametrosPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata) {
        if(!value)
            throw new BadRequestException(`O valor do parâmetro "${metadata.data}" deve estar preenchido`)

        console.log(`Metadata: ${metadata.data} | Value: ${value}`)
        return value
    }

}