import { Request, Response, NextFunction } from 'express';
import { response } from '../helpers/';
import jwt from 'jsonwebtoken';
// import { user_model, admin_model, publisher_model } from '../database/models';
import path from 'path';
import { Admin } from '../database';
import { getRepository } from 'typeorm';

require('dotenv').config({
	path: path.resolve(__dirname, '../../.env')
});

const SECRET_1 = process.env.SECRET_1!;
const SECRET_2 = process.env.SECRET_2!;

export const AuthMiddleware = () => {
	return async function(req: Request, res: Response, next: NextFunction) {
		res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
		res.set('x-token', undefined);
		res.set('x-refresh-token', undefined);
		const token = req.headers['x-token'];
		let jwtData: any = {};		
		if (token) {
			try {
				const user = jwt.verify(<any>token, SECRET_1);
				jwtData = user;
				
				delete jwtData.iat;
				delete jwtData.exp;
				if (!('user_id' in jwtData)) {
					return res.status(401).jsonp(response(401, 'Unauthorized'));
				}
			} catch (err) {
				const refreshToken: any = req.headers['x-refresh-token'];
				if (!refreshToken) {
					return res.status(401).jsonp(response(401, 'Unauthorized'));
				}
				try {
					const user = jwt.decode(<any>refreshToken);
					jwtData = user;
					delete jwtData.iat;
					delete jwtData.exp;
				} catch (err) {
					return res.status(401).jsonp(response(401, 'Unauthorized'));
				}
				if (!('user_id' in jwtData)) {
					return res.status(401).jsonp(response(401, 'Unauthorized'));
				}

				let user: Admin | undefined;
                const userRepository = getRepository(Admin);
                user = await userRepository.findOne({id: jwtData.user_id});

				if (user == undefined || refreshToken != user.refresh_token) {
					if (user != undefined) {
						try {
							user.refresh_token = '';
							if (
								jwtData.user_type == 'ADMIN' ||
								jwtData.user_type == 'PUBLISHER' ||
								jwtData.user_type == 'USER'
							) {
								userRepository.save(user);
							} else {
								return res
									.status(401)
									.jsonp(response(401, 'Unauthorized'));
							}
						} catch (err) {}
					}
					return res.status(401).jsonp(response(401, 'Unauthorized'));
				}
				const refreshSecret = SECRET_2 + user.password;
				try {
					jwt.verify(refreshToken, refreshSecret);
				} catch (err) {
					return res.status(401).jsonp(response(401, 'Unauthorized'));
				}

				const newToken = jwt.sign(jwtData, SECRET_1, {
					expiresIn: '1d'
				});

				const newRefreshToken = jwt.sign(
					jwtData,
					SECRET_2 + user!.password,
					{
						expiresIn: '10d'
					}
				);
				try {
					user.refresh_token = newRefreshToken;
					userRepository.save(user);
				} catch (err) {
					return res
						.status(500)
						.jsonp(response(500, 'Token creation failed'));
				}
				console.log(newToken, newRefreshToken);
				
				if (newToken && newRefreshToken) {
					
					res.set(
						'Access-Control-Expose-Headers',
						'x-token, x-refresh-token'
					);
					res.set('x-token', newToken);
					res.set('x-refresh-token', newRefreshToken);
				}
			}
		} else {
			return res.status(401).jsonp(response(401, 'Unauthorized'));
		}
		req.body.jwt = jwtData;
		return next();
	};
};
