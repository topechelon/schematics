import { BBComponentSchematics } from './schema';

import { strings } from '@angular-devkit/core';

const IGNORED_PREFIXES = [
  'shared',
  'feature'
];

function getUnfilteredPathParts(path: string): Array<string> {
  let parts: Array<string> = path.split('/');
  parts = parts.map(strings.dasherize);
  return parts.filter(part => !IGNORED_PREFIXES.includes(part));
}

function buildClassName(options: BBComponentSchematics): string {
  return strings.classify(getUnfilteredPathParts(options.path).join('-')) + 'Component';
}

function buildSelector(options: BBComponentSchematics): string {
  return options.prefix + getUnfilteredPathParts(options.path).join('-');
}

function buildFileName(options: BBComponentSchematics): string {
  let parts: Array<string> = getUnfilteredPathParts(options.path);
  return parts[parts.length - 1];
}

function buildDirectory(options: BBComponentSchematics): string {
  let parts: Array<string> = options.path.split('/');
  parts = parts.map(strings.dasherize);
  return options.baseDir + '/' + parts.join('/');
}

export interface BBComponentConfiguration {
  fileName: string;
  selector: string;
  className: string;
  directory: string;
  skipImport: boolean;
  export: boolean;
}

export function buildConfig(options: BBComponentSchematics): BBComponentConfiguration {
  return {
    fileName: buildFileName(options),
    selector: buildSelector(options),
    className: buildClassName(options),
    directory: buildDirectory(options),
    skipImport: options.skipImport,
    export: options.export
  };
}