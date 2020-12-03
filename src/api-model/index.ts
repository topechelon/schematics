import { Rule, SchematicContext, Tree, url } from '@angular-devkit/schematics';
import { BBApiModelSchematics } from './schema';

import { strings } from '@angular-devkit/core';

import { generateFiles } from '../utility/generators';
import { buildFileName, buildDirectory, buildClassName } from '../utility/naming';

function buildConfig(options: BBApiModelSchematics) {
  let apiPath = 'core/api/' + options.path;

  return {
    fileName: buildFileName(apiPath),
    className: buildClassName(options.path, ''),
    directory: buildDirectory(apiPath),
    ...strings
  };
}

export function apiModel(options: BBApiModelSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    let config = buildConfig(options);

    return generateFiles(url('./files'), config);
  };
}
