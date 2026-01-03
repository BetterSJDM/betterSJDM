#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building BetterSJDM for production...');

// Clean and create dist folder
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist');

// Copy all files recursively
function copyRecursive(src, dest, exclude = []) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip excluded patterns
    if (exclude.some(pattern => entry.name.match(pattern))) {
      continue;
    }

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying files...');
copyRecursive('.', 'dist', [
  /^node_modules$/,
  /^\.git$/,
  /^dist$/,
  /^\.vscode$/,
  /^backup-restore-point-/,
  /^build\.sh$/,
  /^build\.js$/,
  /^package.*\.json$/,
  /^scripts$/
]);

// Minify HTML files
console.log('Minifying HTML...');
const htmlFiles = [];
function findHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath);
    } else if (entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}
findHtmlFiles('dist');

for (const file of htmlFiles) {
  try {
    execSync(`npx html-minifier-terser --collapse-whitespace --remove-comments --minify-css true --minify-js true -o "${file}" "${file}"`, { stdio: 'inherit' });
  } catch (e) {
    console.warn(`Warning: Failed to minify ${file}`);
  }
}

// Minify CSS files
console.log('Minifying CSS...');
const cssFiles = [];
function findCssFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findCssFiles(fullPath);
    } else if (entry.name.endsWith('.css')) {
      cssFiles.push(fullPath);
    }
  }
}
if (fs.existsSync('dist/assets/css')) {
  findCssFiles('dist/assets/css');
}

for (const file of cssFiles) {
  try {
    execSync(`npx cleancss -o "${file}" "${file}"`, { stdio: 'inherit' });
  } catch (e) {
    console.warn(`Warning: Failed to minify ${file}`);
  }
}

// Minify JS files
console.log('Minifying JavaScript...');
const jsFiles = [];
function findJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findJsFiles(fullPath);
    } else if (entry.name.endsWith('.js')) {
      jsFiles.push(fullPath);
    }
  }
}
if (fs.existsSync('dist/assets/js')) {
  findJsFiles('dist/assets/js');
}

for (const file of jsFiles) {
  try {
    execSync(`npx terser "${file}" -o "${file}" --compress --mangle`, { stdio: 'inherit' });
  } catch (e) {
    console.warn(`Warning: Failed to minify ${file}`);
  }
}

console.log('\nBuild complete!');
console.log('Output: dist/');
