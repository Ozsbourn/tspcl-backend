import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import getRawBody from 'raw-body';


@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
	public use(req: Request, res: Response, next: NextFunction) {
		if (!req.readable) {
			return next(new BadRequestException('Invalid request data'));
		}

		getRawBody(req, {
			encoding: 'utf-8'
		}).then(rawBody => {
			req.body = rawBody;
			next();
		}).catch(err => {
			throw new BadRequestException('Error while getting: ', err);
			next(err);
		});
	}
};