import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Dropzone from "react-dropzone";
import fileDownload from "js-file-download";
// import FileUpload from "react-fileupload";

//@material-ui components
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
// import TableHead from '@material-ui/core/TableHead';

//import redux actions
import * as actions from "../../../../action/fileAction";

const FileManagerStyle = {
  card: {
    marginTop: "10px",
    marginBottom: "10px"
  },
  subCard: {
    marginTop: "10px",
    marginBottom: "10px",
    minHeight: "200px"
  },
  cardContent: {
    paddingTop: "0px",
    paddingBottom: "0px"
  },
  cardHeader: {
    paddingTop: "7px",
    paddingBottom: "5px"
  },
  buttonCenter: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  progress: {
    marginTop: "10px",
    marginBottom: "10px"
  },
  dropZone: {
    minHeight: "200px",
    maxHeight: "200px",
    overflowY: "auto"
  }
};

class FileManager extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      uploadFileQueue: [],
      isUploading: false,
      supportFiles: [],
      productionFiles: [],
      currentUploadingFile: "",
      uploadProgress: {},
      files: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    console.log("FileManagerComponent - didMount - props - ", this.props);
    // this.props.getOrderFiles(this.props.currentOrderId);
    this.getAllFiles();
  }

  componentWillMount() {}

  componentWillUnmount() {
    this._isMounted = false;
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
        console.log(response);
      })
      .catch(function(response) {
        console.log(response);
      });
  };

  downloadFile = file => {
    console.log(file.id);
  };

  handleSupportDrop = file => {
    this.setState(prevState => {
      supportFiles: prevState.supportFiles.push(file);
    });
  };

  handleSupportDropReject = event => {
    console.log("here support drop zone reject: ", event);
  };

  handleProductionDrop = file => {
    this.setState(prevState => {
      productionFiles: prevState.productionFiles.push(file);
    });
  };

  handleProductionDropReject = event => {
    console.log("here production drop zone reject: ", event);
  };

  handleUpload = async () => {
    this.setState({
      isUploading: true,
      uploadProgress: {}
    });

    const promises = [];
    this.state.supportFiles.map((file, index) => {
      promises.push(this.sendRequest(file[0]));
    });
    this.state.productionFiles.map((file, index) => {
      promises.push(this.sendRequest(file[0]));
    });

    try {
      await Promise.all(promises);
      this.setState({
        isUploading: false
      });
      this.getAllFiles();
    } catch (error) {
      this.setState({
        isUploading: false
      });
    }
  };

  sendRequest(file) {
    return new Promise((resolve, reject) => {
      this.setState({
        currentUploadingFile: file.name
      });
      const req = new XMLHttpRequest();

      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          console.log(
            "here upload handler progress: ",
            (event.loaded / event.total) * 100
          );
          const copy = {
            ...this.state.uploadProgress
          };
          copy[file.name] = {
            state: "pending",
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({
            uploadProgress: copy
          });
        }
      });

      req.upload.addEventListener("load", event => {
        const copy = {
          ...this.state.uploadProgress
        };
        copy[file.name] = {
          state: "done",
          percentage: 100
        };
        this.setState({
          uploadProgress: copy
        });
        resolve(req.response);
      });

      req.upload.addEventListener("error", event => {
        const copy = {
          ...this.state.uploadProgress
        };
        copy[file.name] = {
          state: "error",
          percentage: 0
        };
        this.setState({
          uploadProgress: copy
        });
        reject(req.response);
      });

      const formData = new FormData();
      const { currentOrderId } = this.props;
      formData.append("file", file, file.name);
      formData.append("order_id", currentOrderId);

      req.open("POST", "http://localhost:7017/api/upload");
      req.send(formData);
    });
  }

  handleDownload = filename => {
    axios({
      method: "get",
      url: `http://localhost:7017/api/files/${filename}`
    })
      .then(res => {
        fileDownload(res.data, filename);
      })
      .catch(err => {
        console.log("here file download error: ", err);
      });
  };

  getAllFiles = () => {
    axios({
      method: "get",
      url: "http://localhost:7017/api/files"
    })
      .then(res => {
        // console.log('here get all files: ', res.data)
        let files = res.data.map(file => file.filename);
        console.log("here get all files: ", files);
        if (this._isMounted) {
          this.setState({
            files: files
          });
        }
      })
      .catch(err => {
        console.log("here error in get all files: ", err);
      });
  };

  render() {
    const { currentOrderFiles } = this.props;
    const { classes } = this.props;
    // console.log('here current uploading file: ', this.state.currentUploadingFile);

    let currentSupportingFiles = (
      <div>
        {currentOrderFiles &&
          currentOrderFiles
            .filter(file => !file.isProduction)
            .map((file, index) => <p key={index}>{file.fileName}</p>)}
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
        <Card className={classes.card}>
          <CardHeader className={classes.cardHeader} title="File Manager" />
          <CardContent className={classes.cardContent}>
            <div style={{ width: "50%", display: "inline-block" }}>
              <Card className={classes.subCard}>
                <CardHeader title="Supporting Files" />
                <CardContent className={classes.cardContent}>
                  <Dropzone
                    onDrop={this.handleSupportDrop}
                    onDropRejected={this.handleSupportDropReject}
                    disabled={this.state.isUploading}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()} className={classes.dropZone}>
                        <input {...getInputProps()} />
                        {this.state.supportFiles &&
                          this.state.supportFiles.length > 0 &&
                          this.state.supportFiles.map((item, index) => (
                            <p key={index}> {item[0].path} </p>
                          ))}
                        {(!this.state.supportFiles ||
                          this.state.supportFiles.length == 0) && (
                          <p>
                            Drag and drop some files here, or click to select
                            files
                          </p>
                        )}
                      </div>
                    )}
                  </Dropzone>
                </CardContent>
              </Card>
            </div>
            <div style={{ width: "50%", display: "inline-block" }}>
              <Card className={classes.subCard}>
                <CardHeader title="Production Files" />
                <CardContent className={classes.cardContent}>
                  <Dropzone
                    onDrop={this.handleProductionDrop}
                    onDropRejected={this.handleProductionDropReject}
                    disabled={this.state.isUploading}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()} className={classes.dropZone}>
                        <input {...getInputProps()} />
                        {this.state.productionFiles &&
                          this.state.productionFiles.length > 0 &&
                          this.state.productionFiles.map((item, index) => (
                            <p key={index}> {item[0].path} </p>
                          ))}
                        {(!this.state.productionFiles ||
                          this.state.productionFiles.length == 0) && (
                          <p>
                            Drag and drop some files here, or click to select
                            files
                          </p>
                        )}
                      </div>
                    )}
                  </Dropzone>
                </CardContent>
              </Card>
            </div>
            {this.state.isUploading && (
              <div style={{ textAlign: "center" }}>
                <span>
                  {this.state.uploadProgress &&
                    this.state.uploadProgress[
                      this.state.currentUploadingFile
                    ] &&
                    this.state.uploadProgress[this.state.currentUploadingFile]
                      .percentage &&
                    parseInt(
                      this.state.uploadProgress[this.state.currentUploadingFile]
                        .percentage
                    ) + "%"}
                </span>
                <LinearProgress
                  className={classes.progress}
                  variant="determinate"
                  value={
                    this.state.uploadProgress &&
                    this.state.uploadProgress[
                      this.state.currentUploadingFile
                    ] &&
                    this.state.uploadProgress[this.state.currentUploadingFile]
                      .percentage
                      ? this.state.uploadProgress[
                          this.state.currentUploadingFile
                        ].percentage
                      : 0
                  }
                />
              </div>
            )}
          </CardContent>
          <CardActions>
            <Button
              className={classes.buttonCenter}
              variant="contained"
              size="large"
              component="span"
              onClick={this.handleUpload}
            >
              Upload
            </Button>
          </CardActions>
        </Card>
        <Card className={classes.card}>
          <CardHeader title="Download File List" />
          <CardContent>
            <Table>
              <TableBody>
                {this.state.files &&
                  this.state.files.length > 0 &&
                  this.state.files.map((filename, index) => (
                    <TableRow key={index} style={{ cursor: "point" }}>
                      <TableCell>{filename}</TableCell>
                      <TableCell>
                        <Button
                          className={classes.buttonCenter}
                          variant="contained"
                          size="small"
                          component="span"
                          onClick={() => this.handleDownload(filename)}
                        >
                          Download
                        </Button>
                      </TableCell>
                      {/* <a target={'_blank'} href={`http://localhost:7017/api/files/${filename}`}>{filename}</a> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );

    if (this.props.isFetching) {
      return (
        <div>
          <h2>Loading Data</h2>
        </div>
      );
    }

    return <div>{FileManager}</div>;
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

export default withStyles(FileManagerStyle)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FileManager)
);
