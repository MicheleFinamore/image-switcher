const fs= require('fs').promises

const readDirectoryAsync = async (dirPath) => {
    try {
      const data = await fs.readdir(dirPath);
      return data;
    } catch (error) {
      console.error(
        `Got an error trying to read the directory: ${error.message}`
      );
    }
  };
  
  const readFileAsync = async (filePath) => {
    try {
      const data = await fs.readFile(filePath);
      // console.log(data.toString('base64'));
      return data.toString("base64");
    } catch (error) {
      console.error(`Got an error trying to read the file: ${error.message}`);
    }
  };

module.exports =  {
    readDirectoryAsync,
    readFileAsync
}