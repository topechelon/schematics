import { Rule, SchematicContext, Tree, chain, schematic } from '@angular-devkit/schematics';
import { BBApiSchematics } from './schema';

export function api(options: BBApiSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      schematic('api-model', options),
      schematic('api-service', options)
    ]);
  };
}
