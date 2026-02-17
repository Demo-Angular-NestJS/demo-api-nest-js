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
            const result = await this.service.getByFilter({ _id: new Types.ObjectId(id) } as any);
            return this.transform(result);
        } catch (ex) {
            throw new InternalServerErrorException(ex.message);
        }
    }

    @Post()
    public async create(@Body() createDto: CreateDTO, @Req() req: AuthenticatedRequestModel) {
        const created = await this.service.create(createDto, req?.user?.sub);
        return this.transform(created);
    }

    @Post('upsert')
    public async upsert(
        @Body() payload: UpdateDTO,
        @Req() req: AuthenticatedRequestModel,
    ) {
        const identifier = (payload as any).id;

        if (!identifier) {
            const created = await this.service.create(payload as any, req?.user?.sub);
            return this.transform(created);
        }

        const filter = { _id: identifier };
        const result = await this.service.update(filter, payload, req?.user?.sub);

        return this.transform(result);
    }

    @Patch(':id')
    public async update(
        @Param('id') id: string,
        @Body() updateDto: UpdateDTO,
        @Req() req: AuthenticatedRequestModel,
    ) {
        const filter = { _id: id } as any;
        const updated = await this.service.update(filter, updateDto, req?.user?.sub);

        return this.transform(updated);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteSoft(@Param('id') id: string) {
        return await this.service.deleteSoft({ _id: id });
    }

    private transform(data: any): ResponseDTO {
        if (!data) return data;
        const plainData = data instanceof Document ? data.toObject() : data;
        return new this.responseDto(plainData);
    }
}