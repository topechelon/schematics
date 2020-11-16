import { BBModuleSchematics } from './schema';

import { buildFileName, buildDirectory, buildClassName } from '../utility/naming';

export interface BBModuleConfiguration {
  fileName: string;
  className: string;
  directory: string;
}

export function buildConfig(options: BBModuleSchematics): BBModuleConfiguration {
  return {
    fileName: buildFileName(options.path),
    className: buildClassName(options.path, 'Module'),
    directory: buildDirectory(options.path)
  };
}
