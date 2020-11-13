"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.module = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const build_config_1 = require("./build_config");
function module(options) {
    return (_tree, _context) => {
        var _a;
        options.baseDir = (_a = options.baseDir) !== null && _a !== void 0 ? _a : 'src/app';
        let config = build_config_1.buildConfig(options);
        const sourceTemplates = schematics_1.url('./files');
        const sourceParameterizedTemplates = schematics_1.apply(sourceTemplates, [
            schematics_1.template(config),
            schematics_1.forEach((file => {
                return {
                    content: file.content,
                    path: file.path.replace(/\.template$/, '')
                };
            })),
            schematics_1.move(config.directory)
        ]);
        return schematics_1.chain([
            schematics_1.mergeWith(sourceParameterizedTemplates)
        ]);
    };
}
exports.module = module;
//# sourceMappingURL=index.js.map