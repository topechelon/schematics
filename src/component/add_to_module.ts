// Derived from https://github.com/angular/angular-cli/blob/251b53672e500f483ff5669e6f36b995e09c02c5/packages/schematics/angular/component/index.ts#L38

import { BBComponentConfiguration } from './build_config';
import {
  Rule,
  Tree,
  SchematicsException
} from '@angular-devkit/schematics';

import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { addDeclarationToModule, addExportToModule, insertImport } from '@schematics/angular/utility/ast-utils';
import { findModuleFromOptions, buildRelativePath } from '@schematics/angular/utility/find-module';
import { Change, InsertChange } from '@schematics/angular/utility/change';

export function addDeclarationToNgModule(config: BBComponentConfiguration): Rule {
  return (host: Tree) => {
    if (config.skipImport) {
        return host;
    }

    const modulePath = findModuleFromOptions(host, { name: config.directory })?.toString();
    if (!modulePath) {
      throw new Error(`No module found for ${config.directory}`);
    }

    declareInModule(host, modulePath, config);;

    if (config.export) {
      exportFromModule(host, modulePath, config);
    }

    if (config.downgrade) {
      downgradeInModule(host, modulePath, config);
    }

    return host;
  };
}

function declareInModule(host: Tree, modulePath: string, config: BBComponentConfiguration): void {
  const source = readIntoSourceFile(host, modulePath);
  const relativePath = buildRelativePath(modulePath, `/${config.directory}/${config.fileName}.component`);
  const declarationChanges = addDeclarationToModule(source, modulePath, config.className, relativePath);
  applyChanges(host, modulePath, declarationChanges);
};

function exportFromModule(host: Tree, modulePath: string, config: BBComponentConfiguration): void {
  const source = readIntoSourceFile(host, modulePath);
  const relativePath = buildRelativePath(modulePath, `/${config.directory}/${config.fileName}.component`);
  const exportChanges = addExportToModule(source, modulePath, config.className, relativePath);
  applyChanges(host, modulePath, exportChanges);
}

function downgradeInModule(host: Tree, modulePath: string, _config: BBComponentConfiguration): void {
  const source = readIntoSourceFile(host, modulePath);
  const importAngularJSChange = insertImport(source, modulePath, '* as angular', 'angular', true);
  const importDowngradeChange = insertImport(source, modulePath, 'downgradeComponent', '@angular/upgrade/static');
  applyChanges(host, modulePath, [importAngularJSChange, importDowngradeChange]);
}

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

function applyChanges(host: Tree, fileName: string, changes: Change[]): void {
  const recorder = host.beginUpdate(fileName);

  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  }

  host.commitUpdate(recorder);
};
