export const FileHelper = {
  File2Binary: function(files) {
    var fr = new FileReader();
    fr.onload = () => {
      const fileBinaryString = fr.result;
      console.log("fileDropHandler - onload() -", fileBinaryString);
    };
    files.map(file => fr.readAsBinaryString(file));
    return;
  }
};

export default FileHelper;
