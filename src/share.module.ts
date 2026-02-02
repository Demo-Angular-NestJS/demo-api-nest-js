import { Global, Module } from '@nestjs/common';
import { BCryptService, StringService } from 'common';

@Global()
@Module({
    providers: [
        StringService,
        BCryptService,
    ],
    exports: [
        StringService,
        BCryptService,
    ],
})
export class SharedModule { }