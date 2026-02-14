import { FilterConditionEnum } from 'common/enum';
import { FilterCriteriaDTO } from 'common/models';
import { Model } from 'mongoose';

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
        const schemaPath = model.schema.paths[fieldName];

        if (!schemaPath) {
            return;
        }

        let processedValue = value;
        switch (dataType) {
            case 'number':
                processedValue = Number(value);
                if (isNaN(processedValue)) {
                    return;
                }
                break;
            case 'boolean':
                processedValue = value === 'true' || value === true || value === '1' || value === 1;
                break;
            case 'date':
                processedValue = new Date(value);
                if (isNaN(processedValue.getTime())) {
                    return;

                }

                if (condition === FilterConditionEnum.GREATER_EQUAL || condition === FilterConditionEnum.GREATER_THAN) {
                    // Ensure we are at the very start of the day
                    processedValue.setUTCHours(0, 0, 0, 0);
                } else if (condition === FilterConditionEnum.LESS_EQUAL || condition === FilterConditionEnum.LESS_THAN) {
                    // Ensure we include the full day by going to the last millisecond
                    processedValue.setUTCHours(23, 59, 59, 999);
                }
                // processedValue = date;
                break;
            default:
                processedValue = String(value);
        }

        // Mongoose 'instance' helps us know if the DB field is actually a String, Boolean, etc.
        const dbType = schemaPath.instance;

        switch (condition) {
            case FilterConditionEnum.LIKE:
                // Regex ONLY works on Strings. If applied to Boolean/Number, it causes CastError.
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
                // Comparison operators don't make sense for Booleans
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
