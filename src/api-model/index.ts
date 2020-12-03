import { Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';

import { strings } from '@angular-devkit/core';

import { generateFiles } from '../utility/generators';
import { buildFileName, buildDirectory, buildClassName, BaseDirectory } from '../utility/naming';

function buildConfig(options: BBApiModelSchematics) {
  const namingConfig = {
    validBaseDirs: [BaseDirectory.CoreApi],
    defaultBaseDir: BaseDirectory.CoreApi
  };

  return {
    fileName: buildFileName(options.path, namingConfig),
    className: buildClassName(options.path, '', namingConfig),
    directory: buildDirectory(options.path, namingConfig),
    ...strings
  };
}

export function apiModel(options: BBApiModelSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    let config = buildConfig(options);

    return generateFiles(url('./files'), config);
  };
}
