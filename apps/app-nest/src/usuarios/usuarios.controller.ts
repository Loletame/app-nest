import { Body, Controller, Get, HttpStatus, Post, Res, UploadedFile, UploadedFiles, UseInterceptors, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Response } from 'express'
import { UsuarioDto } from './usuarios.dto'
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from '../common';


@Controller('usuarios')
export class UsuariosController {

    constructor(private readonly service: UsuariosService) { }

    @Post('auth/register')

    async register(@Body() usuario: UsuarioDto, @Res() response: Response) {
        const result = await this.service.register(usuario);
        response
            .status(HttpStatus.CREATED)
            .json({ ok: true, result, msg: 'creado' });

    }

    @Post('auth/login')
    async login(
        @Body() usuario: { email: string; password: string },
        @Res() res: Response,
        
    ) {
        const token = await this.service.login(usuario.email, usuario.password);
        const userId = await this.service.getOnebyEmail(usuario.email)
        
        res.status(HttpStatus.OK).json({ ok: true, result: token, msg: `${userId.id}`});
    }

    @Patch(':id')
    @UseInterceptors(FilesInterceptor('files'))
    async updateUser(
        @Param('id') id: number,
        @Body() user: Partial<UsuarioDto>,
        @UploadedFiles() files: Express.Multer.File[],
        @Res() res: Response,


    ) {
        console.log(files);
        // res.status(HttpStatus.OK);
        const result = await this.service.updateUser(id, user, files);[
            {
                fieldname: 'file',
                originalname: 'test.png',
                encoding: '7bit',
                mimetype: 'image/png',
            }
        ]

        res.status(HttpStatus.OK).json({ ok: true, result, msg: 'aprobado' })
    }
    @Delete(':id')
    async deleteUser(@Param('id') id: number, @Res() res: Response) {
        const result = await this.service.deleteUser(id);
        res.status(HttpStatus.OK).json({ ok: true, result });
    }
    @Get(':id')
    async getOne(@Param('id') id: number) {
        return await this.service.getOne(id);
    
    }


    @Get()
    async getAll(@Query() paginationQuery: PaginationQueryDto) {
        return await this.service.getAll(paginationQuery);
    }

    //Experimental

}
