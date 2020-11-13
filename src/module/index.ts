import {
  FileOperator,
  Rule,
  SchematicContext,
  Tree,
  apply,
  mergeWith,
  template,
  url,
  move,
  chain,
  forEach
} from '@angular-devkit/schematics';
import { BBModuleSchematics } from './schema';

import { buildConfig, BBModuleConfiguration } from './build_config';

export function module(options: BBModuleSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    options.baseDir = options.baseDir ?? 'src/app';
    let config: BBModuleConfiguration = buildConfig(options);

    const sourceTemplates = url('./files');
    const sourceParameterizedTemplates = apply(sourceTemplates, [
      template(config),
      forEach((file => {
        return {
          content: file.content,
          path: file.path.replace(/\.template$/, '')
        };
      }) as FileOperator),
      move(config.directory)
    ]);

    return chain([
      mergeWith(sourceParameterizedTemplates)
    ]);
  };
}
