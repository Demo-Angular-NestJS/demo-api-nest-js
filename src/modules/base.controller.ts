import { Body, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Types, Document } from 'mongoose';
import { BaseService, SearchRequestDTO, SearchResponseDTO } from 'common';
import type { AuthenticatedRequestModel } from 'common/models';

export abstract class BaseController<T, CreateDTO, UpdateDTO, ResponseDTO> {
    constructor(
        protected readonly service: BaseService<T, ResponseDTO>,
        private readonly responseDto: new (data: any) => ResponseDTO,
    ) { }

    @Get()
    public async findAll(@Query() query: SearchRequestDTO) {
        const result = await this.service.findAll(query);
        const instances = result.data.map((item: any) => this.transform(item));
        return new SearchResponseDTO(instances, result.meta);
    }

    @Get(':id')
    public async findById(@Param('id') id: string) {
        const result = await this.service.findOne({ _id: new Types.ObjectId(id) } as any);
        return this.transform(result);
    }

    @Post()
    public async create(@Body() createDto: CreateDTO, @Req() req: AuthenticatedRequestModel) {
        const created = await this.service.create(createDto, req?.user?.sub);
        return this.transform(created);
    }

    @Patch(':id')
    public async update(
        @Param('id') id: string,
        @Body() updateDto: UpdateDTO,
        @Req() req: AuthenticatedRequestModel,
    ) {
        const updated = await this.service.update(
            { _id: id } as any,
            updateDto, req?.user?.sub
        );
        return this.transform(updated);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async remove(@Param('id') id: string) {
        return await this.service.delete({ _id: id });
    }

    private transform(data: any): ResponseDTO {
        if (!data) return data;
        const plainData = data instanceof Document ? data.toObject() : data;
        return new this.responseDto(plainData);
    }
}