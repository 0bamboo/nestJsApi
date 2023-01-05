import {Body, Controller, ParseIntPipe, Post, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';


@Controller('auth') // auth is global route 
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	// signup(@Req() req: Request) 
	signup(@Body() dto:AuthDto){
		console.log({dto});
		// console.log(req)
		return this.authService.signup(dto);
	}
	// Another approach :
	// Pipes is functions that transform the data 
	// signup(@Body('email') email: string, @Body('password', ParseIntPipe) password: string) {
	// 	console.log({
	// 		email: email,
	// 		typeOfEmail: typeof email,
	// 		password: password,
	// 		typeOfPass: typeof password
	// 	});
	// 	return this.authService.signup();
	// }
 


	@Post('signin')
	signin(@Body() dto: AuthDto) {
		return this.authService.login(dto);
	}

}