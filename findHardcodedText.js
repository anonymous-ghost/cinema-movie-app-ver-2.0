const fs = require('fs');
const path = require('path');

// Directories to scan
const dirsToScan = ['src/Pages', 'src/components'];

// Regex patterns to identify potential hardcoded text
// Looks for text in JSX: between > and < that's not just whitespace
const HARDCODED_TEXT_REGEX = />([^<>\n\r{}]+?)</g;

// Skip these patterns - they're often not user-visible text
const SKIP_PATTERNS = [
  /^\s+$/,             // Whitespace only
  /^[\d\.,%]+$/,       // Numbers, decimals, percent signs
  /^\$\{.*\}$/,        // Template literals
  /^[()+\-*/=&|:!<>]+$/,  // Operators and symbols
  /^\w+\.\w+$/,        // Object property access (likely variables)
  /^[a-zA-Z0-9_]+$/    // Single words (likely variable names)
];

// File extensions to scan
const extensions = ['.tsx', '.jsx'];

// Results storage
const results = {};

function scanFilesInDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      scanFilesInDirectory(filePath);
    } else if (extensions.includes(path.extname(file))) {
      // Check if it's a React component file
      scanFile(filePath);
    }
  });
}

function shouldSkip(text) {
  // Skip very short strings
  if (text.length <= 1) return true;
  
  // Skip strings that match our skip patterns
  return SKIP_PATTERNS.some(pattern => pattern.test(text.trim()));
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if the file imports useTranslation
  const usesTranslation = /import.*useTranslation/.test(content);
  
  const matches = [];
  let match;
  
  // Look for potential hardcoded text
  while ((match = HARDCODED_TEXT_REGEX.exec(content)) !== null) {
    const textContent = match[1].trim();
    if (!shouldSkip(textContent)) {
      matches.push({
        text: textContent,
        position: match.index
      });
    }
  }
  
  if (matches.length > 0) {
    results[filePath] = {
      usesTranslation,
      matches
    };
  }
}

// Start scanning
dirsToScan.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    scanFilesInDirectory(fullPath);
  } else {
    console.log(`Directory not found: ${fullPath}`);
  }
});

// Output results
console.log('\n===== FILES WITH POTENTIAL HARDCODED TEXT =====\n');

Object.keys(results).forEach(file => {
  const { usesTranslation, matches } = results[file];
  
  console.log(`\nFile: ${file}`);
  console.log(`Uses Translation: ${usesTranslation ? 'YES' : 'NO'}`);
  console.log('Potential hardcoded text:');
  
  matches.forEach(({ text }, index) => {
    console.log(`  ${index + 1}. "${text}"`);
  });
});

const totalFiles = Object.keys(results).length;
const filesWithoutTranslation = Object.values(results).filter(r => !r.usesTranslation).length;

console.log('\n===== SUMMARY =====');
console.log(`Total files with potential hardcoded text: ${totalFiles}`);
console.log(`Files without translation imports: ${filesWithoutTranslation}`);
console.log(`Files with hardcoded text that do import translation: ${totalFiles - filesWithoutTranslation}`); 