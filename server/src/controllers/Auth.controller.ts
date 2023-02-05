import {Admin} from '../database'
import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { response } from '../helpers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
// import path from 'path';

// // dotenv
// require('dotenv').config({
// 	path: path.resolve(__dirname, '../../../.env')
// });

const SECRET_1 = process.env.SECRET_1!;
const SECRET_2 = process.env.SECRET_2!;

export const login = async (
	req: Request,
	res: Response,
	_next: NextFunction
): Promise<any> => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).jsonp(response(400, errors.array()));
	let responseData: any = {};
    const userRepository = getRepository(Admin);
	try {
		let jwtData: any = {};
		let email = req.body.email;
        let user: Admin | undefined;
        user = await userRepository.findOne({email: email});

		if (user) {
			jwtData.user_type = 'ADMIN';
			jwtData.email = user.email;
			jwtData.name = user.name;
		} else {
			return res
				.status(400)
				.jsonp(response(400, 'Not valid user type', []));
		}
		if (user == undefined)
			return res.status(404).jsonp(response(404, 'user not found', []));

		const valid = await bcrypt.compare(
			req.body.password,
			<string>user.password
		);
		if (!valid) {
			return res.status(400).jsonp(response(400, 'Bad password'));
		}

		jwtData.user_id = user.id;
		responseData.user_id = user.id;
		responseData.user_type = jwtData.user_type;
        jwtData.user_name = user.name;
        responseData.user_name = user.name;
        jwtData.user_email = user.email;
        responseData.user_email = user.email;
		responseData.token = jwt.sign(jwtData, SECRET_1, {
			expiresIn: '30m'
		});
		responseData.refresh = jwt.sign(jwtData, SECRET_2 + user.password, {
			expiresIn: '1d'
		});
		user.refresh_token = responseData.refresh;
		userRepository.save(user);
	} catch (err) {
		console.log(err);
		return res.status(500).jsonp(response(500, 'try catch error', err));
	}
	return res
		.status(200)
		.jsonp(response(200, 'login successful', responseData));
};
