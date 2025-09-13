import { localizationFields } from './../interfaces/database.interface';
import { ConflictException } from '@nestjs/common';
import { Schema } from 'mongoose';
import { DatabaseSchema } from 'src/common/database/decorators/database.decorator';
import { DatabaseEntityConstructor } from 'src/common/database/interfaces/database.interface';

export function validateLocalizationFields(schema: Schema, fields: string[]) {
    schema.pre('validate', function (next) {
        for (const field of fields) {
            const value: localizationFields = this[field];
            if (!value?.en) {
                const fieldName =
                    field.charAt(0).toUpperCase() + field.slice(1);
                const err = new ConflictException(
                    `${fieldName} must include an English translation (en)`
                );
                return next(err);
            }
        }
        next();
    });
    return schema;
}

export function ValidateLocalizations(fields: string[]) {
    return function <T extends DatabaseEntityConstructor>(constructor: T) {
        const schema = DatabaseSchema(constructor);
        validateLocalizationFields(schema, fields);
        return constructor;
    };
}
