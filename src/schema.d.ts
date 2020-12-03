/**
 * BB API Model Options Schema
 * Creates a BB API Model
 */
declare interface BBApiModelSchematics {
    /**
     * The path of the model
     */
    path: string;
}
/**
 * BB API Options Schema
 * Creates a BB API Service and Model
 */
declare interface BBApiSchematics {
    /**
     * The path of the model
     */
    path: string;
}
/**
 * BB API Service Options Schema
 * Creates a BB API Service
 */
declare interface BBApiServiceSchematics {
    /**
     * The path of the service
     */
    path: string;
}
/**
 * BB Component Options Schema
 * Creates an Angular component with BB naming conventions
 */
declare interface BBComponentSchematics {
    /**
     * The path of the component
     */
    path: string;
    /**
     * Whether or not the component should automatically be imported into a module (Default: false)
     */
    skipImport?: boolean;
    /**
     * Whether or not the component should automatically be exported from a module (Default: false)
     */
    export?: boolean;
    /**
     * Whether or not the component should automatically be downgraded to AJS (Default: false)
     */
    downgrade?: boolean;
}
/**
 * BB Module Options Schema
 * Creates an Angular module with BB naming conventions
 */
declare interface BBModuleSchematics {
    /**
     * The path of the module
     */
    path: string;
}
/**
 * BB Service Options Schema
 * Creates an Angular service with BB naming conventions
 */
declare interface BBServiceSchematics {
    /**
     * The path of the service
     */
    path: string;
}
/**
 * BB Upgrade Options Schema
 * Creates an Angular directive wrapper for an AJS component
 */
declare interface BBUpgradeSchematics {
    /**
     * The name of the AJS component
     */
    name: string;
}
