// Derived from https://github.com/angular/angular-cli/blob/251b53672e500f483ff5669e6f36b995e09c02c5/packages/schematics/angular/component/index.ts#L38

import { BBComponentConfiguration } from './build_config';
import {
  Rule,
  Tree,
  SchematicsException
} from '@angular-devkit/schematics';

import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { addDeclarationToModule, addExportToModule } from '@schematics/angular/utility/ast-utils';
import { findModuleFromOptions, buildRelativePath } from '@schematics/angular/utility/find-module';
import { InsertChange } from '@schematics/angular/utility/change';

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

export function addDeclarationToNgModule(config: BBComponentConfiguration): Rule {
  return (host: Tree) => {
    if (config.skipImport) {
        return host;
    }

    let modulePath = findModuleFromOptions(host, { name: config.directory })?.toString();
    if (!modulePath) {
      throw new Error(`No module found for ${config.directory}`);
    }

    const source = readIntoSourceFile(host, modulePath);

    const componentPath = `/${config.directory}/${config.fileName}.component`;
    const relativePath = buildRelativePath(modulePath, componentPath);

    const declarationChanges = addDeclarationToModule(source,
                                                      modulePath,
                                                      config.className,
                                                      relativePath);

    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);

    if (config.export) {
      // Need to refresh the AST because we overwrote the file in the host.
      const source = readIntoSourceFile(host, modulePath);

      const exportRecorder = host.beginUpdate(modulePath);
      const exportChanges = addExportToModule(source, modulePath, config.className, relativePath);

      for (const change of exportChanges) {
        if (change instanceof InsertChange) {
          exportRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(exportRecorder);
    }

    return host;
  };
}
