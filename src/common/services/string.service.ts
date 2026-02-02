import { Injectable } from '@nestjs/common';

@Injectable()
export class StringService {

    public removeUndefined<T extends object>(obj: T): T {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => v !== undefined)
        ) as T;
    }
}
