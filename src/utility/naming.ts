import { strings } from '@angular-devkit/core';

const IGNORED_PREFIXES = [
  'shared',
  'feature'
];
const BASE_DIR = 'src/app';
const SELECTOR_PREFIX = 'bb-';

export function buildDirectory(path: string): string {
  let parts = path.split('/');
  parts = parts.map(strings.dasherize);
  return BASE_DIR + '/' + parts.join('/');
}

export function buildFileName(path: string): string {
  let parts = getUnfilteredPathParts(path);
  return parts[parts.length - 1];
}

export function buildClassName(path: string, suffix: string): string {
  return strings.classify(getUnfilteredPathParts(path).join('-')) + suffix;
}

export function buildSelector(path: string): string {
  return SELECTOR_PREFIX + getUnfilteredPathParts(path).join('-');
}

function getUnfilteredPathParts(path: string): Array<string> {
  let parts = path.split('/');
  parts = parts.map(strings.dasherize);
  return parts.filter(part => !IGNORED_PREFIXES.includes(part));
}
