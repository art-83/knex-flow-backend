import { Project, SyntaxKind } from 'ts-morph';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..');
const srcDir = path.join(rootDir, 'src');

const project = new Project({
  tsConfigFilePath: path.join(rootDir, 'tsconfig.json'),
});

project.addSourceFilesAtPaths(path.join(srcDir, '**/*.ts'));

function isRelativeModule(moduleSpecifier) {
  return moduleSpecifier.startsWith('.');
}

function getExportNameFromDefault(exportAssignment, sourceFile) {
  const expression = exportAssignment.getExpression();
  if (!expression) {
    const decl =
      exportAssignment.getDescendantsOfKind(SyntaxKind.ClassDeclaration)[0] ??
      exportAssignment.getDescendantsOfKind(SyntaxKind.FunctionDeclaration)[0] ??
      exportAssignment.getDescendantsOfKind(SyntaxKind.InterfaceDeclaration)[0] ??
      exportAssignment.getDescendantsOfKind(SyntaxKind.EnumDeclaration)[0];
    return decl?.getName();
  }

  if (expression.getKind() === SyntaxKind.Identifier) {
    return expression.getText();
  }

  const parent = expression.getParent();
  if (parent && parent.getKind() === SyntaxKind.ClassDeclaration) {
    return parent.getName();
  }
  if (parent && parent.getKind() === SyntaxKind.FunctionDeclaration) {
    return parent.getName();
  }

  return undefined;
}

function collectExistingNamedExportBlock(sourceFile) {
  const exportDecls = sourceFile.getExportDeclarations();
  for (const decl of exportDecls) {
    if (decl.getModuleSpecifier()) continue;
    const names = decl.getNamedExports().map(n => n.getName());
    if (names.length > 0) return { decl, names: new Set(names) };
  }
  return { decl: null, names: new Set() };
}

function processExports(sourceFile) {
  const namesToExport = new Set();
  const { decl: existingExportDecl, names: existingNames } = collectExistingNamedExportBlock(sourceFile);

  for (const name of existingNames) {
    namesToExport.add(name);
  }

  for (const exportAssignment of sourceFile.getExportAssignments()) {
    if (!exportAssignment.isExportEquals()) {
      const name = getExportNameFromDefault(exportAssignment, sourceFile);
      if (name) namesToExport.add(name);
      exportAssignment.remove();
    }
  }

  const exportableKinds = [
    SyntaxKind.ClassDeclaration,
    SyntaxKind.InterfaceDeclaration,
    SyntaxKind.EnumDeclaration,
    SyntaxKind.FunctionDeclaration,
    SyntaxKind.TypeAliasDeclaration,
  ];

  for (const kind of exportableKinds) {
    for (const decl of sourceFile.getDescendantsOfKind(kind)) {
      if (!decl.isExported()) continue;
      const name = decl.getName();
      if (!name) continue;
      namesToExport.add(name);
      decl.setIsExported(false);
    }
  }

  for (const varStmt of sourceFile.getVariableStatements()) {
    if (!varStmt.isExported()) continue;
    for (const decl of varStmt.getDeclarations()) {
      const name = decl.getName();
      if (name) namesToExport.add(name);
    }
    varStmt.setIsExported(false);
  }

  if (namesToExport.size === 0) return;

  const sortedNames = [...namesToExport].sort();

  if (existingExportDecl) {
    existingExportDecl.remove();
  }

  const trailingNewline = sourceFile.getFullText().endsWith('\n') ? '' : '\n';
  sourceFile.addStatements(`${trailingNewline}export { ${sortedNames.join(', ')} };`);
}

function processImports(sourceFile) {
  for (const importDecl of sourceFile.getImportDeclarations()) {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    if (!isRelativeModule(moduleSpecifier)) continue;

    const defaultImport = importDecl.getDefaultImport();
    if (!defaultImport) continue;

    const name = defaultImport.getText();
    importDecl.removeDefaultImport();
    importDecl.addNamedImport(name);
  }
}

for (const sourceFile of project.getSourceFiles()) {
  if (!sourceFile.getFilePath().includes(`${path.sep}src${path.sep}`)) continue;
  processExports(sourceFile);
}

for (const sourceFile of project.getSourceFiles()) {
  if (!sourceFile.getFilePath().includes(`${path.sep}src${path.sep}`)) continue;
  processImports(sourceFile);
}

project.saveSync();

console.log('Standardized exports and imports in src/');
