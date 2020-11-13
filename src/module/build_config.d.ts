import { BBModuleSchematics } from './schema';
export interface BBModuleConfiguration {
    fileName: string;
    className: string;
    directory: string;
}
export declare function buildConfig(options: BBModuleSchematics): BBModuleConfiguration;
