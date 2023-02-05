import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { getRepository } from "typeorm";
import { response } from "../helpers";
import { Admin } from "../database";
import bcrypt from 'bcryptjs';

export const createUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).jsonp(response(400, errors.array()));
    let User: Admin;
    const userRepository = getRepository(Admin);
    try {
        if(req.body.password !== req.body.sub_password)
            return res.status(400).jsonp(response(400, 'Passwords do not match'));

        let pass: string = await bcrypt.hash(req.body.password, 10);

        User = userRepository.create({
            name: req.body.name,
            email: req.body.email,
            password: pass
        });

        await userRepository.save(User);
	} catch (error) {
		return res.status(400).jsonp(response(400, 'TryCatch Error', error));
	}
	return res
		.status(200)
		.jsonp(response(200, 'User created', User));
};
