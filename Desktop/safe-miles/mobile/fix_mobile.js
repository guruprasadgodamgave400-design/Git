const fs = require('fs');
const path = require('path');

const files = [
  'src/services/SocketService.js',
  'src/screens/VerificationUploadScreen.js',
  'src/screens/SignupScreen.js',
  'src/screens/NotificationListScreen.js',
  'src/screens/LoginScreen.js',
  'src/navigation/AppNavigation.js',
  'src/components/DamageUpload.js'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf-8');
  if (content.includes('http://localhost:3000')) {
    // Add import statement at the top
    if (!content.includes('import { API_URL }')) {
        let importPath = '../api/config';
        content = `import { API_URL } from '${importPath}';\n` + content;
    }
    
    // Replace string literals with template literals using API_URL
    content = content.replace(/'http:\/\/localhost:3000([^']*)'/g, '`${API_URL}$1`');
    content = content.replace(/"http:\/\/localhost:3000([^"]*)"/g, '`${API_URL}$1`');
    // Replace backticks
    content = content.replace(/`http:\/\/localhost:3000([^`]*)`/g, '`${API_URL}$1`');

    // Special case for SocketService
    content = content.replace("const SOCKET_URL = `${API_URL}`;", "const SOCKET_URL = API_URL;");
    
    fs.writeFileSync(f, content);
    console.log('Fixed', f);
  }
});
