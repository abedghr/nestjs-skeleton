import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from 'src/common/request/enums/request.status-code.enum';

export class RequestValidationException extends Error {
    readonly httpStatus: HttpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
    readonly statusCode: number = ENUM_REQUEST_STATUS_CODE_ERROR.VALIDATION;
    readonly errors: ValidationError[];

    constructor(errors: ValidationError[]) {
        super('request.validation');
        this.errors = this.buildErrorMessages(errors);
    }

    private buildErrorMessages(errors: ValidationError[]): any[] {
        const errorsArray: any[] = [];
        for (const error of errors) {
            if (error.children && error.children.length > 0) {
                // Recursively build errors for child validations
                const childErrors = this.buildErrorMessages(error.children);
                // Push child errors into the main array
                errorsArray.push(...childErrors);
            } else {
                // Only push errors that do not have children
                errorsArray.push({
                    property: error.property,
                    constraints: error.constraints,
                    message: Object.values(error.constraints || {}).join(', '), // Join all constraint messages
                });
            }
        }

        return errorsArray;
    }
}
