import { Body, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { Types, Document } from 'mongoose';
import { BaseService, SearchRequestDTO } from 'common';
import type { AuthenticatedRequestModel } from 'common/models';
import type { Response } from 'express';

export abstract class BaseController<T, CreateDTO, UpdateDTO, ResponseDTO> {
    constructor(
        protected readonly service: BaseService<T, ResponseDTO>,
        private readonly responseDto: new (data: any) => ResponseDTO,
    ) { }

    @Post('search')
    public async search(
        @Body() payload: SearchRequestDTO,
        @Res({ passthrough: true }) res: Response
    ) {
        const { data, total } = await this.service.search(payload);

        res.append('X-Total-Count', total.toString());
        res.set('Access-Control-Expose-Headers', 'X-Total-Count');
        return data;
    }

    @Get()
    public async getWithQuery(@Query() query: SearchRequestDTO) {
        const { data } = await this.service.search(query);
        return data;
    }

    @Get(':id')
    public async getById(@Param('id') id: string) {
        try {
            const result = await this.service.getById(id);
            return result;
        } catch (ex) {
            throw new InternalServerErrorException(ex.message);
        }
    }

    @Post()
    public async create(@Body() createDto: CreateDTO, @Req() req: AuthenticatedRequestModel) {
        return await this.service.create(createDto, req?.user?.sub);
    }

    @Post('upsert')
    public async upsert(
        @Body() payload: UpdateDTO,
        @Req() req: AuthenticatedRequestModel,
    ) {
        const id = (payload as any).id || (payload as any)._id;

        if (id) {
            return await this.service.upsert({ _id: id }, payload, req?.user?.sub);
        }

        return await this.service.create(payload as any, req?.user?.sub);
    }

    @Patch(':id')
    public async update(
        @Param('id') id: string,
        @Body() updateDto: UpdateDTO,
        @Req() req: AuthenticatedRequestModel,
    ) {
        return await this.service.update({ _id: id }, updateDto, req?.user?.sub);
    }

    @Delete('soft/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteSoft(@Param('id') id: string) {
        return await this.service.delete({ _id: id }, true);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async delete(@Param('id') id: string) {
        return await this.service.delete({ _id: id });
    }

    public transform(data: any): ResponseDTO {
        if (!data) return data;
        const plainData = data instanceof Document ? data.toObject() : data;
        return new this.responseDto(plainData);
    }
}