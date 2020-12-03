import { Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';

import { strings } from '@angular-devkit/core';

import { generateFiles } from '../utility/generators';
import { buildFileName, buildDirectory, buildClassName } from '../utility/naming';
import { buildRelativePath } from '@schematics/angular/utility/find-module';

function buildConfig(options: BBApiServiceSchematics) {
  let apiPath = 'core/api/' + options.path;

  let apiServicePath = buildRelativePath('/' + buildDirectory(apiPath), '/src/app/core/api/api.service');

  return {
    fileName: buildFileName(apiPath),
    serviceClassName: buildClassName(options.path, 'Service'),
    modelClassName: buildClassName(options.path, ''),
    directory: buildDirectory(apiPath),
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
