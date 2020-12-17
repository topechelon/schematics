import { Rule, SchematicContext, Tree, url, chain } from '@angular-devkit/schematics';

import { addDeclarationToNgModule, generateFiles } from '../utility/generators';
import { buildFileName, buildDirectory, buildClassName, buildPipeSelector, BaseDirectory } from '../utility/naming';

const namingConfig = {
  validBaseDirs: [
    BaseDirectory.Feature,
    BaseDirectory.Shared
  ]
};

function buildConfig(options: BBDirectiveSchematics) {
  return {
    fileName: buildFileName(options.path, namingConfig),
    selector: buildPipeSelector(options.path, namingConfig),
    className: buildClassName(options.path, 'Directive', namingConfig),
    directory: buildDirectory(options.path, namingConfig),
    skipImport: false,
    export: true
  };
}

export function directive(options: BBDirectiveSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    options.export = options.export ?? false;

    let config = buildConfig(options);

    return chain([
      addDeclarationToNgModule({ ...config, fileType: 'directive' }),
      generateFiles(url('./files'), config)
    ]);
  };
}
