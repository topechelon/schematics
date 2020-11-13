"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.component = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const add_to_module_1 = require("./add_to_module");
const build_config_1 = require("./build_config");
function component(options) {
    return (_tree, _context) => {
        var _a, _b, _c, _d;
        options.prefix = (_a = options.prefix) !== null && _a !== void 0 ? _a : 'bb-';
        options.baseDir = (_b = options.baseDir) !== null && _b !== void 0 ? _b : 'src/app';
        options.skipImport = (_c = options.skipImport) !== null && _c !== void 0 ? _c : false;
        options.export = (_d = options.export) !== null && _d !== void 0 ? _d : true;
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
            add_to_module_1.addDeclarationToNgModule(config),
            schematics_1.mergeWith(sourceParameterizedTemplates)
        ]);
    };
}
exports.component = component;
//# sourceMappingURL=index.js.map