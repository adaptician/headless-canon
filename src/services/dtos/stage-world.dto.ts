import {IsString} from 'class-validator';

export class StageWorld {
    @IsString()
    id!: string; // Add `!` if using strict mode
}