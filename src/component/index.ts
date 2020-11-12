import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { BBComponentSchematics } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function component(_options: BBComponentSchematics): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}
