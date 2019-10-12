import React, { Component } from "react";
import Dropzone from "react-dropzone";
import * as actions from "../../../../action/fileAction";
import { connect } from "react-redux";
import axios from "axios";
import FileUpload from "react-fileupload";

class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = { uploadFileQueue: [] };
  }

  componentDidMount() {
    console.log("FileManagerComponent - didMount - props - ", this.props);
    this.props.getOrderFiles(this.props.currentOrderId);
  }

  fileDownload = file => {
    console.log("download file - ", file);
  };

  // ProductionFilesDropHandler = files => {
  //   //deal with files
  //   const { currentOrderId } = this.props;
  //   files.map(file => {
  //     var fr = new FileReader();
  //     const CurrentFile = {};

  //     fr.onload = () => {
  //       CurrentFile.fileName = file.name;
  //       CurrentFile.fileData = fr.result;
  //       CurrentFile.order_id = currentOrderId;
  //       CurrentFile.isProduction = true;
  //       CurrentFile.fileType = "Draft";
  //       this.setState({
  //         uploadFileQueue: [...this.state.uploadFileQueue, CurrentFile]
  //       });
  //       console.log("fileDropHandler - onload() -CurrentFile", CurrentFile);
  //       this.props.newFile(CurrentFile);
  //     };

  //     fr.readAsArrayBuffer(file);
  //   });
  // };

  ProductionFilesDropHandler = file => {
    //deal with files
    const { currentOrderId } = this.props;
    let bodyFormData = new FormData();
    bodyFormData.set("order_id", currentOrderId);
    bodyFormData.append("file", file);
    // this.props.newFile(bodyFormData);
    console.log(bodyFormData);
  };

  uploadHandler = file => {
    const { currentOrderId } = this.props;
    let bodyFormData = new FormData();
    bodyFormData.set("order_id", currentOrderId);
    bodyFormData.append("file", file);
    axios({
      method: "post",
      url: "http://localhost:7017/api/upload",
      data: bodyFormData,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(function(response) {
        //handle success
        console.log(response);
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };

  downloadFile = file => {
    console.log(file.id);
  };

  render() {
    const { currentOrderFiles } = this.props;

    let currentSupportingFiles = (
      <div>
        {currentOrderFiles &&
          currentOrderFiles
            .filter(file => !file.isProduction)
            .map(file => <p>{file.fileName}</p>)}
      </div>
    );
    let currentProductionFiles = (
      <div>
        {currentOrderFiles &&
          currentOrderFiles
            .filter(file => file.isProduction)
            .map(file => (
              <p onClick={() => this.fileDownload(file)}>{file.fileName}</p>
            ))}
      </div>
    );

    const options = {
      baseUrl: "http://localhost:7017/api/upload",
      param: {
        fid: 0
      }
    };

    const FileManager = (
      <div>
        <h4>FileManager</h4>
        <div className="OrderDetailFileManager">
          <div className="FileManagerFileManagerLeft">
            <h4>SupportingFiles</h4>

            {currentSupportingFiles}
          </div>

          <Dropzone onDrop={files => this.uploadHandler(files)}>
            {/* <Dropzone onDrop={files => this.ProductionFilesDropHandler(files)}> */}
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="FileManagerFileManagerRight">
                <h4>ProductionFiles</h4>
                {currentProductionFiles}

                {this.state.uploadFileQueue.map(i => (
                  <a onClick={() => this.downloadFile(i)}>{i.fileName}</a>
                ))}
              </div>
            )}
          </Dropzone>
        </div>

        <form
          action="http://localhost:7017/api/upload"
          method="POST"
          enctype="multipart/form-data"
        >
          <div class="custom-file mb-3">
            <input
              type="file"
              name="file"
              id="file"
              class="custom-file-input"
            />

            <label for="file" class="custom-file-label">
              Choose File
            </label>
            <input type="text" name="orderID" placeholder="orderID" />
          </div>
          <input
            type="submit"
            value="Submit"
            class="btn btn-primary btn-block"
          />
        </form>
      </div>
    );

    if (this.props.isFetching) {
      return (
        <div>
          <h2>Loading Data</h2>
        </div>
      );
    }

    return (
      <div>
        {FileManager}
        {/* <FileUpload options={options}>
          <button ref="chooseBtn">choose</button>
          <button ref="uploadBtn">upload</button>
        </FileUpload> */}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getOrderFiles: order_id => {
      dispatch(actions.getOrderFiles(order_id));
    },
    newFile: file => {
      dispatch(actions.newFile(file));
    }
  };
};

const mapStateToProps = state => {
  const { file } = state;
  return {
    isFileFetching: file.isFileFetching,
    err: file.err,
    currentOrderFiles: file.currentOrderFiles
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileManager);
