import { BBComponentSchematics } from './schema';

import { buildFileName, buildDirectory, buildClassName, buildSelector } from '../utility/naming';

export interface BBComponentConfiguration {
  fileName: string;
  selector: string;
  className: string;
  directory: string;
  skipImport: boolean;
  export: boolean;
  downgrade: boolean;
}

export function buildConfig(options: BBComponentSchematics): BBComponentConfiguration {
  return {
    fileName: buildFileName(options.path),
    selector: buildSelector(options.path),
    className: buildClassName(options.path, 'Component'),
    directory: buildDirectory(options.path),
    skipImport: options.skipImport,
    export: options.export,
    downgrade: options.downgrade
  };
}
