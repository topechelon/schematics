import { strings } from '@angular-devkit/core';

const IGNORED_PREFIXES = [
  'common',
  'feature',
  'core',
  'shared'
];
const SELECTOR_PREFIX = 'bb-';

export function buildDirectory(path: string): string {
  let parts = getUnfilteredPathParts(path);
  return `src/app/${getBaseDirectory(path)}/${parts.join('/')}`;
}

// Default to the feature/ dir if shared/ or core/ are not specified
let getBaseDirectory = (path: string): string => {
  path = path.replace(/^\//, '');
  let firstPart = path.split('/')[0].toLowerCase();
  if (IGNORED_PREFIXES.includes(firstPart)) {
    return firstPart;
  }

  return 'feature';
};

export function buildFileName(path: string): string {
  let parts = getUnfilteredPathParts(path);
  return parts[parts.length - 1];
}

export function buildClassName(path: string, suffix: string): string {
  let className = strings.classify(getUnfilteredPathParts(path).join('-'));
  validateClassName(className, path, suffix);

  return className + suffix;
}

let validateClassName = (className: string, path: string, suffix: string) => {
  let suffixRegex = new RegExp(`[_\\-]?${suffix}$`, 'i');
  if (!suffix || !suffixRegex.test(className)) {
    return;
  }

  let replacement = path.replace(suffixRegex, '');
  throw new Error(`Invalid name: ${path}. Did you mean ${replacement}?`);
};

export function buildSelector(path: string): string {
  return SELECTOR_PREFIX + getUnfilteredPathParts(path).join('-');
}

function getUnfilteredPathParts(path: string): Array<string> {
  let parts = path.split('/');
  parts = parts.map(strings.dasherize);
  return parts.filter(part => !IGNORED_PREFIXES.includes(part));
}
