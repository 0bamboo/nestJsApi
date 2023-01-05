import {ForbiddenException, Injectable} from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	async login(dto: AuthDto) {
		// Find user by email:
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			}
		});

		// If user doesn't exist throw an exception :
		if (!user)
			throw new ForbiddenException('Credentials incorrect !');

		// if user exists compare password:
		const pwMatches = await argon.verify(user.hash, dto.password);

		// if password is incorrect throw an exception:
		if (!pwMatches)
			throw new ForbiddenException('Credentials incorrect !');
		
		// return user
		delete user.hash;
		return user;

		// return {
		// 	msg: 'I have signed in .',
		// };
	}

	async signup(dto: AuthDto) {
		// generate the password hash
		const hash = await argon.hash(dto.password);

		// save the new user in the db
		try{

			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					hash: hash
				},
			})
			
			
			// returned the saved user
			return user;
		}catch(error){
			if (error instanceof PrismaClientKnownRequestError)
			{
				if (error.code === "P2002")
				{
					throw new ForbiddenException('Credentials taken');
				}
			}
			throw error;
		}
		// return {
		// 	msg: 'I have signed up .',
		// };
	}
}