import { Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';

import { strings } from '@angular-devkit/core';

import { generateFiles } from '../utility/generators';
import { buildFileName, buildDirectory, buildClassName, BaseDirectory } from '../utility/naming';
import { buildRelativePath } from '@schematics/angular/utility/find-module';

const namingConfig = {
  validBaseDirs: [BaseDirectory.CoreApi],
  defaultBaseDir: BaseDirectory.CoreApi
};

function buildConfig(options: BBApiServiceSchematics) {
  let apiServicePath = buildRelativePath('/' + buildDirectory(options.path, namingConfig), '/src/app/core/api.service');

  return {
    fileName: buildFileName(options.path, namingConfig),
    serviceClassName: buildClassName(options.path, 'Service', namingConfig),
    modelType: buildClassName(options.path, '', namingConfig),
    directory: buildDirectory(options.path, namingConfig),
    apiServicePath,
    ...strings
  };
}

export function apiService(options: BBApiServiceSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    let config = buildConfig(options);

    return generateFiles(url('./files'), config);
  };
}
