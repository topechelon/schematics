import { BBComponentSchematics } from './schema';
export interface BBComponentConfiguration {
    fileName: string;
    selector: string;
    className: string;
    directory: string;
    skipImport: boolean;
    export: boolean;
}
export declare function buildConfig(options: BBComponentSchematics): BBComponentConfiguration;
