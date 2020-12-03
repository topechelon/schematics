import { Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';

import { generateFiles } from '../utility/generators';
import { buildFileName, buildDirectory, buildClassName, BaseDirectory } from '../utility/naming';

function buildConfig(options: BBModuleSchematics) {
  const namingConfig = {
    validBaseDirs: [
      BaseDirectory.Core,
      BaseDirectory.Feature,
      BaseDirectory.Shared
    ],
    defaultBaseDir: BaseDirectory.Feature
  };

  return {
    fileName: buildFileName(options.path, namingConfig),
    className: buildClassName(options.path, 'Module', namingConfig),
    directory: buildDirectory(options.path, namingConfig)
  };
}

export function module(options: BBModuleSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    let config = buildConfig(options);

    return generateFiles(url('./files'), config);
  };
}
