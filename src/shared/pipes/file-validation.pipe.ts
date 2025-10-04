import {
	type ArgumentMetadata,
	Injectable,
	type PipeTransform,
    BadRequestException,
} from "@nestjs/common";
import { ReadStream } from "fs";
import { validateFileFormat, validateFileSize } from "../utils/file.util";

@Injectable()
export class FileValidationPipe implements PipeTransform {
	public async transform(value: any, _metadata: ArgumentMetadata) {
		if (!value.filename) {
			throw new BadRequestException(`File wasn't uploaded`);
		} 

		const { filename, createReadStream } = value;
		const fileStream = createReadStream() as ReadStream; 
		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
		const isFormatFileValid = validateFileFormat(filename, allowedFormats);

		if (!isFormatFileValid) {
			throw new BadRequestException('Unsupported file format'); 
		}

		const isFileSizeValid = await validateFileSize(fileStream, 10 * 1024 * 1024); // 10MB
		if (!isFileSizeValid) {
			throw new BadRequestException('File size can not be greater than 10MB');
		}

		return value;
	}
}
