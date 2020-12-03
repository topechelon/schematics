import { Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';

import { generateFiles } from '../utility/generators';
import { buildFileName, buildDirectory, buildClassName } from '../utility/naming';

function buildConfig(options: BBModuleSchematics) {
  return {
    fileName: buildFileName(options.path),
    className: buildClassName(options.path, 'Module'),
    directory: buildDirectory(options.path)
  };
}

export function module(options: BBModuleSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    let config = buildConfig(options);

    return generateFiles(url('./files'), config);
  };
}
