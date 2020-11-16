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
import { BBComponentSchematics } from './schema';

import { addDeclarationToNgModule, downgradeComponentInNgModule } from '../utility/generators';
import { buildConfig, BBComponentConfiguration } from './build_config';

export function component(options: BBComponentSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    options.skipImport = options.skipImport ?? false;
    options.export = options.export ?? false;
    options.downgrade = options.downgrade ?? false;

    let config: BBComponentConfiguration = buildConfig(options);

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
      addDeclarationToNgModule({ ...config, fileType: 'component' }),
      downgradeComponentInNgModule(config),
      mergeWith(sourceParameterizedTemplates)
    ]);
  };
}
