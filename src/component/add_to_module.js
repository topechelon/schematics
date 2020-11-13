"use strict";
// Derived from https://github.com/angular/angular-cli/blob/251b53672e500f483ff5669e6f36b995e09c02c5/packages/schematics/angular/component/index.ts#L38
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDeclarationToNgModule = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const ts = require("@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const find_module_1 = require("@schematics/angular/utility/find-module");
const change_1 = require("@schematics/angular/utility/change");
function readIntoSourceFile(host, modulePath) {
    const text = host.read(modulePath);
    if (text === null) {
        throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
    }
    const sourceText = text.toString('utf-8');
    return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}
function addDeclarationToNgModule(config) {
    return (host) => {
        var _a;
        if (config.skipImport) {
            return host;
        }
        let modulePath = (_a = find_module_1.findModuleFromOptions(host, { name: config.directory })) === null || _a === void 0 ? void 0 : _a.toString();
        if (!modulePath) {
            throw new Error(`No module found for ${config.directory}`);
        }
        const source = readIntoSourceFile(host, modulePath);
        const componentPath = `/${config.directory}/${config.fileName}.component.ts`;
        const relativePath = find_module_1.buildRelativePath(modulePath, componentPath);
        console.log(relativePath);
        const declarationChanges = ast_utils_1.addDeclarationToModule(source, modulePath, config.className, relativePath);
        const declarationRecorder = host.beginUpdate(modulePath);
        for (const change of declarationChanges) {
            if (change instanceof change_1.InsertChange) {
                declarationRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(declarationRecorder);
        if (config.export) {
            // Need to refresh the AST because we overwrote the file in the host.
            const source = readIntoSourceFile(host, modulePath);
            const exportRecorder = host.beginUpdate(modulePath);
            const exportChanges = ast_utils_1.addExportToModule(source, modulePath, config.className, relativePath);
            for (const change of exportChanges) {
                if (change instanceof change_1.InsertChange) {
                    exportRecorder.insertLeft(change.pos, change.toAdd);
                }
            }
            host.commitUpdate(exportRecorder);
        }
        return host;
    };
}
exports.addDeclarationToNgModule = addDeclarationToNgModule;
//# sourceMappingURL=add_to_module.js.map