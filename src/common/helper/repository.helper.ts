import { FilterConditionEnum } from 'common/enum';
import { FilterCriteriaDTO } from 'common/models';
import { Model, mongo } from 'mongoose';

export const buildDefaultFilter = (model: Model<any>): Record<string, any> => {
    const filter: Record<string, any> = {};

    if (model.schema.paths['isDeleted']) {
        filter.isDeleted = { $ne: true };
    }

    if (model.schema.paths['isActive']) {
        filter.isActive = true;
    }

    return filter;
};

export const mapFilterCriteria = (model: Model<any>, queryFilters: FilterCriteriaDTO[]): Record<string, any> => {
    const mongoFilter: Record<string, any> = {};

    queryFilters.forEach(({ fieldName, value, condition, dataType }) => {
        const isDeepSearch = fieldName.includes('.');
        const schemaPath = model.schema.paths[fieldName];

        if (!isDeepSearch && !schemaPath) {
            return;
        }

        let processedValue = value;
        switch (dataType) {
            case 'number':
                processedValue = Number(value);
                if (isNaN(processedValue)) return;
                break;
            case 'boolean':
                processedValue = value === 'true' || value === true || value === '1' || value === 1;
                break;
            case 'date':
                processedValue = new Date(value);
                if (isNaN(processedValue.getTime())) return;

                if (condition === FilterConditionEnum.GREATER_EQUAL || condition === FilterConditionEnum.GREATER_THAN) {
                    processedValue.setUTCHours(0, 0, 0, 0);
                } else if (condition === FilterConditionEnum.LESS_EQUAL || condition === FilterConditionEnum.LESS_THAN) {
                    processedValue.setUTCHours(23, 59, 59, 999);
                }
                break;
            default:
                processedValue = String(value);
        }

        const dbType = isDeepSearch ? 'String' : schemaPath.instance;

        switch (condition) {
            case FilterConditionEnum.LIKE:
                if (dbType === 'String') {
                    mongoFilter[fieldName] = { $regex: processedValue, $options: 'i' };
                } else {
                    mongoFilter[fieldName] = processedValue;
                }
                break;

            case FilterConditionEnum.EQUAL:
                mongoFilter[fieldName] = processedValue;
                break;

            case FilterConditionEnum.NOT_EQUAL:
                mongoFilter[fieldName] = { $ne: processedValue };
                break;

            case FilterConditionEnum.GREATER_THAN:
            case FilterConditionEnum.GREATER_EQUAL:
            case FilterConditionEnum.LESS_THAN:
            case FilterConditionEnum.LESS_EQUAL:
                if (dbType === 'Boolean') {
                    mongoFilter[fieldName] = processedValue;
                } else {
                    const operator = {
                        [FilterConditionEnum.GREATER_THAN]: '$gt',
                        [FilterConditionEnum.GREATER_EQUAL]: '$gte',
                        [FilterConditionEnum.LESS_THAN]: '$lt',
                        [FilterConditionEnum.LESS_EQUAL]: '$lte',
                    }[condition];
                    mongoFilter[fieldName] = { [operator]: processedValue };
                }
                break;
        }
    });

    return mongoFilter;
};
