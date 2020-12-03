import { strings } from '@angular-devkit/core';

const SELECTOR_PREFIX = 'bb-';

export enum BaseDirectory {
  CoreApi = 'core/api',
  Core = 'core',
  Feature = 'feature',
  Shared = 'shared'
};

interface NamingConfig {
  validBaseDirs: BaseDirectory[];
  defaultBaseDir?: BaseDirectory;
}

export function buildDirectory(path: string, config: NamingConfig): string {
  let parts = getFilteredPathParts(path, config);
  return `src/app/${getBaseDirectory(path, config)}/${parts.join('/')}`;
}

export function buildFileName(path: string, config: NamingConfig): string {
  let parts = getFilteredPathParts(path, config);
  return parts[parts.length - 1];
}

export function buildClassName(path: string, suffix: string, config: NamingConfig): string {
  let className = strings.classify(getFilteredPathParts(path, config).join('-'));
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

export function buildSelector(path: string, config: NamingConfig): string {
  return SELECTOR_PREFIX + getFilteredPathParts(path, config).join('-');
}

function getFilteredPathParts(path: string, config: NamingConfig): Array<string> {
  let baseDir = getBaseDirectory(path, config);
  path = path.replace(`${baseDir}`, '');

  let parts = path.split(/\/+/).filter(part => !!part);
  return parts.map(strings.dasherize)
}

let getBaseDirectory = (path: string, config: NamingConfig): string => {
  let baseDir = Object.values(BaseDirectory).find(v => path.startsWith(`${v}/`));
  if (!baseDir && config.defaultBaseDir) {
    return config.defaultBaseDir;
  }

  if (!baseDir || !config.validBaseDirs.includes(baseDir)) {
    let firstPart = baseDir ?? path.split('/')[0];
    throw new Error(`Invalid base directory: ${firstPart}. Valid directories are ${config.validBaseDirs.join(', ')}`);
  }

  return baseDir;
}
