import { Rule, SchematicContext, Tree, url, chain } from '@angular-devkit/schematics';

import { addDeclarationToNgModule, downgradeComponentInNgModule, generateFiles } from '../utility/generators';
import { buildFileName, buildDirectory, buildClassName, buildSelector } from '../utility/naming';

function buildConfig(options: BBComponentSchematics) {
  return {
    fileName: buildFileName(options.path),
    selector: buildSelector(options.path),
    className: buildClassName(options.path, 'Component'),
    directory: buildDirectory(options.path),
    skipImport: options.skipImport ?? false,
    export: options.export ?? false,
    downgrade: options.downgrade ?? false
  };
}

export function component(options: BBComponentSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    options.skipImport = options.skipImport ?? false;
    options.export = options.export ?? false;
    options.downgrade = options.downgrade ?? false;

    let config = buildConfig(options);

    return chain([
      addDeclarationToNgModule({ ...config, fileType: 'component' }),
      downgradeComponentInNgModule(config),
      generateFiles(url('./files'), config)
    ]);
  };
}
