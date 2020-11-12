import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  mergeWith,
  template,
  url
} from '@angular-devkit/schematics';
import { BBComponentSchematics } from './schema';

import { strings } from '@angular-devkit/core';

const IGNORED_PREFIXES = [
  'shared',
  'feature'
];

function getPathParts(path: string): Array<string> {
  let parts: Array<string> = path.split('/');
  parts = parts.map(strings.dasherize);
  return parts.filter(part => !IGNORED_PREFIXES.includes(part));
}

function buildClassName(path: string): string {
  return strings.classify(getPathParts(path).join('-'));
}

function buildSelector(path: string): string {
  return 'bb-' + getPathParts(path).join('-');
}

function buildFileName(path: string): string {
  let parts: Array<string> = getPathParts(path);
  return parts[parts.length - 1];
}

export function component(options: BBComponentSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const { path } = options;

    const sourceTemplates = url('./files');
    const sourceParameterizedTemplates = apply(sourceTemplates, [
      template({
        selector: buildSelector(path),
        fileName: buildFileName(path),
        buildClassName: buildClassName(path)
      })
    ]);

    return mergeWith(sourceParameterizedTemplates);
  };
}
