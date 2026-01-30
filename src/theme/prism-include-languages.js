import siteConfig from '@generated/docusaurus.config';

export default function prismIncludeLanguages(PrismObject) {
  const {
    themeConfig: {prism},
  } = siteConfig;
  const {additionalLanguages} = prism;
  
  // Define daad language - order matters!
  PrismObject.languages.daad = {
    // Comments
    comment: {
      pattern: /#.*/,
      greedy: true,
    },
    
    // Strings
    string: {
      pattern: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
      greedy: true,
    },
    
    // Triple-quoted strings (if you support them)
    'triple-quoted-string': {
      pattern: /("""|''')[\s\S]*?\1/,
      greedy: true,
      alias: 'string',
    },
    
    // DECORATOR/MAGIC METHODS like __بناء__ - BEFORE function pattern
    decorator: {
      pattern: /\b__[\u0600-\u06FFa-zA-Z_][\u0600-\u06FFa-zA-Z0-9_]*__\b/u,
      alias: 'function',
    },
    
    // KEYWORDS - Must come BEFORE class-name and function patterns!
    keyword: /\b(?:دالة|فئة|صنف|اذا|إذا|لو|واذا|وإذا|ولو|والا|وإلا|طالما|مادام|لكل|في|كرر|مرات|مرة|ارجع|أرجع|اخرج|أخرج|تابع|استورد|إستورد|كـ|ك|باسم|و|او|أو|ليس|لا)\b/u,
    
    // BOOLEAN values
    boolean: /\b(?:صحيح|خطا|خطأ)\b/u,
    
    // BUILTIN keywords like ذاتي (self)
    builtin: /\b(?:ذاتي)\b/u,
    
    // CLASS NAME - only the name part (after keyword is already matched)
    'class-name': {
      pattern: /(\b(?:صنف|فئة)\s+)[\u0600-\u06FFa-zA-Z_][\u0600-\u06FFa-zA-Z0-9_]*/u,
      lookbehind: true,
    },
    
    // FUNCTION CALLS (any identifier followed by parentheses)
    'function': {
      pattern: /[\u0600-\u06FFa-zA-Z_][\u0600-\u06FFa-zA-Z0-9_]*(?=\s*\()/u,
    },
    
    // PROPERTY/ATTRIBUTE access (after dot)
    property: {
      pattern: /(\.)\s*[\u0600-\u06FFa-zA-Z_][\u0600-\u06FFa-zA-Z0-9_]*/u,
      lookbehind: true,
    },
    
    // NUMBERS (integers and floats)
    number: /\b\d+(?:\.\d+)?\b/u,
    
    // OPERATORS
    operator: /[-+*/%=<>!&|]+|==|!=|<=|>=|\+=|-=|\*=|\/=/,
    
    // PUNCTUATION
    punctuation: /[{}[\]();:,.]/,
  };
  
  // Load other additional languages
  globalThis.Prism = PrismObject;
  additionalLanguages.forEach((lang) => {
    if (lang === 'daad') {
      return;
    }
    require(`prismjs/components/prism-${lang}`);
  });
  delete globalThis.Prism;
}