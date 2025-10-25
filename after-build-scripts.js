const fs = require('fs');
const path = require('path');

function createHTAccess(){
    console.log('Creating .htaccess file...');
    /** Path to the build directory */
    const buildPath = path.join(__dirname, 'build');
    const HTAccessFilePath = path.join(__dirname, '.htaccess');
    /** Path to the file you want to write inside the build directory */
    const filePath = path.join(buildPath, '.htaccess');

    /** Content to write into the file */
    const content = fs.readFileSync(HTAccessFilePath);
    /** Check if build directory exists */
    if (fs.existsSync(buildPath)) {
        /** Write file inside the build directory */
        try{
            fs.writeFileSync(filePath, content);
            console.log('.htaccess file created successfully.');
        }catch(err){
            console.log(err.message);
            console.error(err);
        }
    }
}

createHTAccess(); /** Creating the .htaccess file inside the build folder */