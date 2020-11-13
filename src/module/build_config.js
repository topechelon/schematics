"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildConfig = void 0;
const core_1 = require("@angular-devkit/core");
const IGNORED_PREFIXES = [
    'shared',
    'feature'
];
function getUnfilteredPathParts(path) {
    let parts = path.split('/');
    parts = parts.map(core_1.strings.dasherize);
    return parts.filter(part => !IGNORED_PREFIXES.includes(part));
}
function buildClassName(options) {
    return core_1.strings.classify(getUnfilteredPathParts(options.path).join('-')) + 'Module';
}
function buildFileName(options) {
    let parts = getUnfilteredPathParts(options.path);
    return parts[parts.length - 1];
}
function buildDirectory(options) {
    let parts = options.path.split('/');
    parts = parts.map(core_1.strings.dasherize);
    return options.baseDir + '/' + parts.join('/');
}
function buildConfig(options) {
    return {
        fileName: buildFileName(options),
        className: buildClassName(options),
        directory: buildDirectory(options)
    };
}
exports.buildConfig = buildConfig;
//# sourceMappingURL=build_config.js.map