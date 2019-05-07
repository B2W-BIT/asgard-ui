/* eslint-disable no-console */
import Bridge from "../helpers/Bridge";
import React from "react/addons";
import config from "../config/config";
import MarathonService from "../plugin/sdk/services/MarathonService";
import DialogActions from "../actions/DialogActions";

const BLOCK_SIZE = 1024;
let loading = 0;

export default React.createClass({
  displayName: "TaskLogComponent",

  propTypes: {
    logfile: React.PropTypes.string,
    task: React.PropTypes.object
  },

  getInitialState() {
    return {
      logdata: [],
      loadingBottom : false,
      loadingTop : false,
      topLog : 0,
    };
  },
  componentDidMount() {

    this.bottomOffset = 0;
    this.topOffset = 0;
    this.logData = [];
    this.meuTeste = 0;
    this.pollBottom = this.pollBottom;
    this.handleReadOK = this.handleReadOK;
    this.handleReadTopOK = this.handleReadTopOK;
    this.stopPollBottom = this.stopPollBottom;
    this.startPollBottom = this.startPollBottom;
    this.startPollBottom();
    const el = this.refs && this.refs.logView && this.refs.logView.getDOMNode();
    const ref = this;
    let currentScrollLeft = el.scrollLeft;

    el.addEventListener("scroll", function () {
      if (currentScrollLeft !== el.scrollLeft) {
        currentScrollLeft = el.scrollLeft;
        return;
      }
      // check is scroll top
      if (el.scrollTop === 0) {
        ref.setState ({loadingTop : true}, () => {
          ref.pollTop();
          ref.stopPollBottom();
        });
      }
      // scroll not top and bottom
      if (el.scrollTop + el.clientHeight + 2 < el.scrollHeight) {
        ref.setState({loadingTop: false, loadingBottom: false}, () => {
          ref.stopPollBottom();
        });
      }
      // check is scroll bottom
      const isBottom = ref.checkIsBottom(el);
      if (isBottom) {
        el.scrollTop = el.scrollHeight;
        ref.restartPoolBottom();
      }
    });
  },
  componentWillUnmount() {
    this.stopPollBottom();
  },
  stopPollBottom() {
    clearInterval(this.intervalId);
  },
  /* eslint-disable max-len */
  startPollBottom() {
    const url = `tasks/${this.props.task.id}/files/read?path=${this.props.logfile}&offset=-1`;
    MarathonService.request({
      resource: url}
    ).success((response) => {
      const totalOffset = response.body.offset;
      this.bottomOffset = totalOffset;
      this.bottomOffset -= Math.min(totalOffset, BLOCK_SIZE);
      this.topOffset = totalOffset;
      this.topOffset -= Math.min(totalOffset, BLOCK_SIZE);
      this.intervalId = setInterval(this.pollBottom, 1000);
    }).error((data) => {
      console.log(`ERROR ${this.props.task.id}, ${this.props.logfile}. ${data}`);
    });
  },

  restartPoolBottom() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.pollBottom, 1000);
  },

  pollBottom() {
    this.setState({loadingBottom: true}, () => {
      MarathonService.request({resource:`tasks/${this.props.task.id}/files/read?path=${this.props.logfile}&offset=${this.bottomOffset}&length=${BLOCK_SIZE}`})
      .success(this.handleReadOK)
      .error((data) => {
        console.log(`ERROR task ${this.props.task.id}, ${this.props.logfile}. ${data}`);
      });
    });
  },

  pollTop() {
    let newLength = BLOCK_SIZE;
    if (this.topOffset < 0) {
      newLength = newLength + this.topOffset;
    }
    if (this.topOffset !== 0) {
      this.topOffset -= BLOCK_SIZE;
      this.setState({loadingTop: true} , () => {
        MarathonService.request({resource:`tasks/${this.props.task.id}/files/read?path=${this.props.logfile}&offset=${this.topOffset < 0 ? this.topOffset = 0 : this.topOffset }&length=${newLength}`})
        .success(this.handleReadTopOK)
        .error((data) => {
          console.log(`ERROR task ${this.props.task.id}, ${this.props.logfile}. ${data}`);
        });
      });
    }
    else {
      this.setState ({topLog: 1});
      loading = 1;
    }
  },
  /* eslint-enable */

  handleReadOK(response) {
    const {data} = response.body;
    const truncate = response.body.truncate;
    this.setState({loadingBottom: false});
    if (data) {
      this.bottomOffset += data.length;
      this.logData.push(data);
      if (truncate) {
        // this.bottomOffset = data.offset;
        const totalOffset = data.offset;
        this.logData.push("-----------------------------------------------------------------");
        this.bottomOffset = totalOffset;
        this.bottomOffset -= Math.min(totalOffset, BLOCK_SIZE);
        this.topOffset = totalOffset;
        this.topOffset -= Math.min(totalOffset, BLOCK_SIZE);
        this.intervalId = setInterval(this.pollBottom, 1000);
      }
      this.onNewlogData(this.logData);
    }
  },

  handleReadTopOK(response) {
    const {data} = response.body;
    if (data) {
      this.logData.unshift(data);
      this.onNewTop(this.logData);
    }
  },
  onNewTop(logdata) {
    const el = this.refs && this.refs.logView && this.refs.logView.getDOMNode();
    let prevHeightScroll = el.scrollHeight;
    this.setState({
      logdata: logdata,
    }, () => {
      if (prevHeightScroll === el.scrollHeight) {
        el.scrollTop = el.scrollHeight;
      } else {
        el.scrollTop = el.scrollHeight - prevHeightScroll;
      }
    });
  },
  onNewlogData(logdata) {
    const ref = this.refs;
    this.setState({
      logdata: logdata,
    }, () => {
      const el = ref && ref.logView && ref.logView.getDOMNode();
      el.scrollTop = el.scrollHeight;
    });
  },

  checkIsBottom(el) {
    return Math.round(el.scrollTop + el.clientHeight) >= el.scrollHeight;
  },
  handleDownload() {
    const {task, logfile} = this.props;
    const url = `tasks/${task.id}/files/download?path=${logfile}`;
    MarathonService.request({resource: url}
    ).success((response) => {
      Bridge.navigateTo(`${config.apiURL}${response.body.download_url}`);
    }).error((data) => {
      console.log(`ERROR ${task.id}, ${logfile}. ${data}`);
      DialogActions.alert({message: `Falha ao baixar log: ${data.body}`});
    });
  },
  getLogLines() {
    if (this.reader) {
      return this.logData;
    }
    return [];
  },
  /* eslint-disable max-len */
  render() {
    return(
      <div className="tab-pane">
        <div className="row col-sm-12">
          <button
            className="btn btn-sm btn-default"
            onClick={this.handleDownload}>
            Download
          </button>
        </div>
        <div className="log-view" ref="logView">
          {this.state.loadingTop && loading === 0 ? <div className="header-loading"><i className="icon icon-large loading loading-bottom"></i></div>: ""}
          {this.state.topLog === 1 && <span>TOPO DO LOG<br></br></span>}
          <div className="scroll-infinity">
            {this.state.logdata}
          </div>
        </div>
        { this.state.loadingBottom ? <div className="header-loading"><i className="icon icon-large loading loading-bottom"></i></div> : <div className="header-loading"></div>  }
      </div>
    );
  }
});