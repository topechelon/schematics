import { Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';

import { generateFiles } from '../utility/generators';
import { buildFileName, buildDirectory, buildClassName, BaseDirectory } from '../utility/naming';

function buildConfig(options: BBServiceSchematics) {
  const namingConfig = {
    validBaseDirs: [
      BaseDirectory.Core,
      BaseDirectory.Feature
    ],
    defaultBaseDir: BaseDirectory.Core
  };

  return {
    fileName: buildFileName(options.path, namingConfig),
    className: buildClassName(options.path, 'Service', namingConfig),
    directory: buildDirectory(options.path, namingConfig)
  };
}

export function service(options: BBServiceSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    let config = buildConfig(options);

    return generateFiles(url('./files'), config);
  };
}
