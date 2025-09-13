import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { CountryCode, isValidPhoneNumber } from 'libphonenumber-js';

@ValidatorConstraint({ async: true })
@Injectable()
export class AllowedMobileNumberConstraint
    implements ValidatorConstraintInterface
{
    validate(mobileNumber: string, args: ValidationArguments) {
        const countryCodes: string[] = args.constraints[0]; // Accept an array of country codes

        return countryCodes.some((countryCode: CountryCode) =>
            isValidPhoneNumber(mobileNumber, countryCode)
        );
    }
}

export function IsAllowedMobileNumber(
    countryCodes: string[],
    validationOptions?: ValidationOptions
) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [countryCodes],
            validator: AllowedMobileNumberConstraint,
        });
    };
}
