const fs = require('fs');
const path = require('path');
const https = require('https');

const MESSAGES_DIR = path.join(__dirname, 'messages');
const REFERENCE_FILE = 'en.json';

// Helper function to translate text using Google Translate API
async function translateText(text, targetLang) {
  return new Promise((resolve, reject) => {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodedText}`;
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          // Extract translated text from the response
          if (Array.isArray(jsonData) && jsonData[0] && Array.isArray(jsonData[0])) {
            const translatedText = jsonData[0]
              .map(sentence => sentence[0])
              .join('');
            resolve(translatedText);
          } else {
            reject(new Error('Unexpected response format'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Convert language file code to Google Translate language code
function getGoogleTranslateCode(langCode) {
  // Most language codes are the same, but some need conversion
  const langCodeMap = {
    'zh': 'zh-CN', // Chinese (Simplified)
    'nb': 'no',    // Norwegian
    'fil': 'tl',   // Filipino/Tagalog
  };
  
  return langCodeMap[langCode] || langCode;
}

// Recursively process nested objects and translate missing keys
async function processObject(enObj, targetObj, targetLang) {
  const result = { ...targetObj };
  
  for (const key in enObj) {
    if (typeof enObj[key] === 'object' && enObj[key] !== null) {
      // Handle nested objects
      if (!result[key] || typeof result[key] !== 'object') {
        result[key] = {};
      }
      result[key] = await processObject(enObj[key], result[key] || {}, targetLang);
    } else {
      // Handle string values
      if (result[key] === undefined || result[key] === enObj[key]) {
        try {
          // Only translate if the key is missing or has the same value as English
          console.log(`Translating "${enObj[key]}" to ${targetLang}`);
          result[key] = await translateText(enObj[key], targetLang);
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.error(`Error translating "${enObj[key]}": ${error.message}`);
          // Fallback to English if translation fails
          result[key] = enObj[key];
        }
      }
    }
  }
  
  return result;
}

async function main() {
  try {
    // Read the reference English file
    const enFilePath = path.join(MESSAGES_DIR, REFERENCE_FILE);
    const enContent = fs.readFileSync(enFilePath, 'utf8');
    const enData = JSON.parse(enContent);
    
    // Get all language files
    const files = fs.readdirSync(MESSAGES_DIR);
    
    // Process each language file except English
    for (const file of files) {
      if (file === REFERENCE_FILE) continue;
      
      const langCode = path.basename(file, '.json');
      const googleLangCode = getGoogleTranslateCode(langCode);
      const filePath = path.join(MESSAGES_DIR, file);
      
      console.log(`Processing ${file} (${googleLangCode})...`);
      
      try {
        // Read the target language file
        const targetContent = fs.readFileSync(filePath, 'utf8');
        const targetData = JSON.parse(targetContent);
        
        // Process and translate missing keys
        const updatedData = await processObject(enData, targetData, googleLangCode);
        
        // Write the updated content back to the file
        fs.writeFileSync(
          filePath,
          JSON.stringify(updatedData, null, 2),
          'utf8'
        );
        
        console.log(`✅ Successfully updated ${file}`);
      } catch (error) {
        console.error(`❌ Error processing ${file}: ${error.message}`);
      }
    }
    
    console.log('Translation completed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Run the script
main();