import { GEO_LOCATION_TYPE } from '../constants/database.enum.constants';

export interface IDatabaseLocationField {
    type: GEO_LOCATION_TYPE;
    coordinates: number[];
}