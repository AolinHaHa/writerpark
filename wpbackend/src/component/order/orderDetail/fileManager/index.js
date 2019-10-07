import React, { Component } from "react";
import Dropzone from "react-dropzone";
import FileHelper from "../../../../common/helper/fileHelper";

class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = { uploadFileQueue: [] };
  }

  componentDidMount() {
    console.log("FileManagerComponent - didMount - props - ", this.props);
  }

  SupportingFilesDropHandler = files => {
    //deal with files
    files.map(file => {
      var fr = new FileReader();
      const CurrentFile = {};

      fr.onload = () => {
        CurrentFile.fileName = file.name;
        CurrentFile.fileLastModified = file.lastModified;
        CurrentFile.fileBinaryString = fr.result;
        this.setState({
          uploadFileQueue: [...this.state.uploadFileQueue, CurrentFile]
        });
        console.log("fileDropHandler - onload() -CurrentFile", CurrentFile);
      };
      //trigger onload ↓
      fr.readAsDataURL(file);
    });
  };

  render() {
    const { viewOrder } = this.props.data;

    const FileManager = (
      <div>
        <h4>FileManager</h4>
        <div className="OrderDetailFileManager">
          <div className="FileManagerFileManagerLeft">
            <h4>SupportingFiles</h4>
          </div>

          <Dropzone
            onDrop={targetFile => this.SupportingFilesDropHandler(targetFile)}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="FileManagerFileManagerRight">
                <h4>ProductionFiles</h4>
                {this.state.uploadFileQueue.map(i => (
                  <p>{i.fileName}</p>
                ))}
              </div>
            )}
          </Dropzone>
        </div>
      </div>
    );

    if (this.props.isFetching) {
      return (
        <div>
          <h2>Loading Data</h2>
        </div>
      );
    }

    return FileManager;
  }
}

export default FileManager;
