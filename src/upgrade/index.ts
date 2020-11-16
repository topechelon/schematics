import { Rule, SchematicContext, Tree, url, chain } from '@angular-devkit/schematics';
import { BBUpgradeSchematics } from './schema';

import { strings } from '@angular-devkit/core';

import { addDeclarationToNgModule, generateFiles } from '../utility/generators';

function buildConfig(options: BBUpgradeSchematics) {
  let selector = strings.dasherize(options.name);
  let fileName = selector.replace(/^bb3-/, '');
  let className = strings.classify(fileName) + 'Directive';
  return {
    name: options.name,
    fileName: selector.replace(/^bb3-/, ''),
    selector: selector,
    className: className,
    directory: 'src/app/shared/ajs/' + fileName,
    skipImport: false,
    export: true
  };
}

export function upgrade(options: BBUpgradeSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    let config = buildConfig(options);

    return chain([
      addDeclarationToNgModule({ ...config, fileType: 'directive' }),
      generateFiles(url('./files'), config)
    ]);
  };
}
