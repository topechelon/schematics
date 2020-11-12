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
  forEach
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

function buildClassName(options: BBComponentSchematics): string {
  return strings.classify(getPathParts(options.path).join('-'));
}

function buildSelector(options: BBComponentSchematics): string {
  return options.prefix + getPathParts(options.path).join('-');
}

function buildFileName(options: BBComponentSchematics): string {
  let parts: Array<string> = getPathParts(options.path);
  return parts[parts.length - 1];
}

function buildDirName(options: BBComponentSchematics): string {
  let parts: Array<string> = options.path.split('/');
  parts = parts.map(strings.dasherize);
  return options.baseDir + parts.join('/');
}

export function component(options: BBComponentSchematics): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    options.baseDir = options.baseDir ?? 'src/app/';
    options.prefix = options.prefix ?? 'bb-';

    const sourceTemplates = url('./files');
    const sourceParameterizedTemplates = apply(sourceTemplates, [
      template({
        selector: buildSelector(options),
        fileName: buildFileName(options),
        className: buildClassName(options)
      }),
      forEach((file => {
        return {
          content: file.content,
          path: file.path.replace(/\.template$/, '')
        };
      }) as FileOperator),
      move(buildDirName(options))
    ]);

    return mergeWith(sourceParameterizedTemplates);
  };
}
