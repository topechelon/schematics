import { BBModuleSchematics } from './schema';

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

function buildClassName(options: BBModuleSchematics): string {
  return strings.classify(getUnfilteredPathParts(options.path).join('-')) + 'Module';
}

function buildFileName(options: BBModuleSchematics): string {
  let parts: Array<string> = getUnfilteredPathParts(options.path);
  return parts[parts.length - 1];
}

function buildDirectory(options: BBModuleSchematics): string {
  let parts: Array<string> = options.path.split('/');
  parts = parts.map(strings.dasherize);
  return options.baseDir + '/' + parts.join('/');
}

export interface BBModuleConfiguration {
  fileName: string;
  className: string;
  directory: string;
}

export function buildConfig(options: BBModuleSchematics): BBModuleConfiguration {
  return {
    fileName: buildFileName(options),
    className: buildClassName(options),
    directory: buildDirectory(options)
  };
}
