// Derived from https://github.com/angular/angular-cli/blob/251b53672e500f483ff5669e6f36b995e09c02c5/packages/schematics/angular/component/index.ts#L38
import {
  FileOperator,
  Rule,
  Tree,
  SchematicsException,
  apply,
  mergeWith,
  template,
  move,
  forEach
} from '@angular-devkit/schematics';

import { strings } from '@angular-devkit/core';

import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { addDeclarationToModule, addExportToModule, insertImport, insertAfterLastOccurrence, findNodes } from '@schematics/angular/utility/ast-utils';
import { findModuleFromOptions, buildRelativePath } from '@schematics/angular/utility/find-module';
import { Change, InsertChange } from '@schematics/angular/utility/change';

interface BBDeclarationConfiguration {
  skipImport: boolean;
  export: boolean;
  directory: string;
  fileName: string;
  className: string;
  fileType: string;
  modulePath?: string;
}

export function addDeclarationToNgModule(config: BBDeclarationConfiguration): Rule {
  return (host: Tree) => {
    if (config.skipImport) {
      return host;
    }

    const modulePath = config.modulePath ?? getModulePath(host, config.directory);

    if (modulePath.includes('app.module.ts')) {
      if (config.directory.includes('src/app/feature/')) {
        let expectedFeaturePath = config.directory.split('src/app/feature/')[1].split('/')[0];
        let expectedFeatureModule = strings.classify(expectedFeaturePath) + 'Module';
        throw new Error(`${expectedFeatureModule} does not exist - please create it (feature/${expectedFeaturePath}) or specify a valid path.`);
      }

      throw new Error('Declarations should not be added to the AppModule - please create feature module or specify a valid path (core/, shared/, etc).');
    }

    const source = readIntoSourceFile(host, modulePath);
    const relativePath = buildRelativePath(modulePath, `/${config.directory}/${config.fileName}.${config.fileType}`);
    const declarationChanges = addDeclarationToModule(source, modulePath, config.className, relativePath);
    applyChanges(host, modulePath, declarationChanges);

    if (config.export) {
      const source = readIntoSourceFile(host, modulePath);
      const relativePath = buildRelativePath(modulePath, `/${config.directory}/${config.fileName}.${config.fileType}`);
      const exportChanges = addExportToModule(source, modulePath, config.className, relativePath);
      applyChanges(host, modulePath, exportChanges);
    }

    return host;
  };
}

interface BBDowngradeConfiguration {
  skipImport: boolean;
  downgrade: boolean;
  directory: string;
  selector: string;
  className: string;
}

export function downgradeComponentInNgModule(config: BBDowngradeConfiguration): Rule {
  return (host: Tree) => {
    if (config.skipImport || !config.downgrade) {
      return host;
    }

    const modulePath = getModulePath(host, config.directory);
    let source = readIntoSourceFile(host, modulePath);
    const importAngularJSChange = insertImport(source, modulePath, '* as angular', 'angular', true);
    const importDowngradeChange = insertImport(source, modulePath, 'downgradeComponent', '@angular/upgrade/static');
    applyChanges(host, modulePath, [importAngularJSChange, importDowngradeChange]);

    source = readIntoSourceFile(host, modulePath);
    const allImports = findNodes(source, ts.SyntaxKind.ImportDeclaration);
    const otherDowngrades = findNodes(source, ts.SyntaxKind.ExpressionStatement).filter(node => node.getFullText().includes('angular.module(\'bb3\')'));

    const downgradeChange = insertAfterLastOccurrence(otherDowngrades, `\nangular.module('bb3').directive('${strings.camelize(config.selector)}', downgradeComponent({ component: ${config.className} }));`, modulePath, allImports[allImports.length - 1].end);

    applyChanges(host, modulePath, [downgradeChange]);
  };
}

function getModulePath(host: Tree, directory: string): string {
  const modulePath = findModuleFromOptions(host, { name: directory })?.toString();
  if (!modulePath) {
    throw new Error(`No module found for ${directory}`);
  }

  return modulePath;
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
}

export function generateFiles(sourceTemplates: any, config: any) {
  const sourceParameterizedTemplates = apply(sourceTemplates, [
    template(config),
    forEach((file => {
      return {
        content: file.content,
        path: file.path.replace(/\.template$/, '')
      };
    }) as FileOperator),
    move(config.directory)
  ]);
  return mergeWith(sourceParameterizedTemplates)

}
