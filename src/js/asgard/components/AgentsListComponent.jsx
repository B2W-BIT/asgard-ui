import React from "react";
import Centered from "../../components/CenteredInlineDialogComponent";
import classNames from "classnames";
import AgentsComponent from "../components/AgentsComponent";
import AgentsStore from "../stores/AgentsStore";
import AgentsEvents from "../events/AgentsEvents";
import States from "../../constants/States";
import lazy from "lazy.js";
import AgentsActions from "../actions/AgentsActions";
import ConcatFilter from "../helpers/concatFilters";

var SlaveListComponent = React.createClass({
  displayName: "AgentsListComponent",

  getInitialState: function () {
    var agents = AgentsStore.agents;
    var total = AgentsStore.total;
    var totalApps = AgentsStore.length;
    var fetchState =
      agents.length > 0 ? States.STATE_SUCCESS : States.STATE_LOADING;
    return {
      agents: agents,
      fetchState: fetchState,
      slave: 0,
      filterText: "",
      activated: false,
      focused: false,
      total: total,
      length: totalApps,
      sortKey: "hostname",
      sortDescending: false
    };
  },
  componentWillMount: function () {
    AgentsActions.requestAgents();
    AgentsStore.on(AgentsEvents.CHANGE, this.onAgentsChange);
    AgentsStore.on(AgentsEvents.FILTER, this.requestAgents);
  },

  componentWillUnmount: function () {
    AgentsStore.removeListener(AgentsEvents.CHANGE, this.onAgentsChange);
    AgentsStore.removeListener(AgentsEvents.FILTER, this.requestAgents);
    AgentsActions.setFilter("");
  },
  onAgentsChange: function () {
    this.setState({
      agents: AgentsStore.agents,
      total: AgentsStore.total,
      fetchState: States.STATE_SUCCESS,
      length: AgentsStore.agents.length,
    });
  },
  getInlineDialog: function () {
    var state = this.state;
    var pageIsLoading = state.fetchState === States.STATE_LOADING;
    var pageHasNoAgents =
      !pageIsLoading &&
      state.agents.length === 0 &&
      state.fetchState !== States.STATE_UNAUTHORIZED &&
      state.fetchState !== States.STATE_FORBIDDEN;

    if (pageIsLoading) {
      let message = "Please wait while agents are being retrieved";
      let title = "Loading Agents...";

      return (
        <Centered>
          <div>
            <i className="icon icon-large loading" />
            <h3 className="h3">{title}</h3>
            <p className="muted">{message}</p>
          </div>
        </Centered>
      );
    }
    if (pageHasNoAgents) {
      return (
        <Centered
          title="No Agents"
          message="Cluster Agents will be shown here"
        />
      );
    }
    return null;
  },
  sortBy: function (sortKey) {
    var state = this.state;

    this.setState({
      sortKey: sortKey,
      sortDescending: state.sortKey === sortKey && !state.sortDescending
    });
  },
  getAgentsNodes: function () {
    var state = this.state;
    var sortKey = state.sortKey;
    var length = state.length;

    return lazy(state.agents)
      .sortBy(function (agents) {
        if (sortKey === "cpu_pct" || sortKey === "ram_pct") {
          return agents.stats[sortKey];
        } else {
          return agents[sortKey];
        }
      }, state.sortDescending)
      .map(function (agents) {
        return (
          <AgentsComponent total={length} key={agents.id} sortKey={sortKey} model={agents} />
        );
      })
      .value();
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var filterText = this.state.filterText;
    var changeFilter = ConcatFilter.format(filterText);
    AgentsActions.setFilter(changeFilter);
  },
  requestAgents: function () {
    AgentsActions.requestAgents();
  },
  handleKeyDown: function (event) {
    switch (event.key) {
      case "Escape":
        event.target.blur();
        this.handleClearFilterText();
        break;
      case "Enter":
        this.handleSubmit(event);
        break;
    }
  },
  focusInputGroup: function () {
    this.setState({
      focused: true,
      activated: true
    });
  },
  handleFilterTextChange: function (event) {
    var filterText = event.target.value;
    this.setState({filterText}, () => {
      if (filterText == null || filterText === "") {
        this.handleClearFilterText();
      }
    });
  },

  getCaret: function (sortKey) {
    if (sortKey === this.state.sortKey) {
      return <span className="caret" />;
    }
    return null;
  },

  handleClick: function () {
    this.setState({filterText: ""});
    AgentsActions.setFilter("");
    this.getInlineDialog();
  },

  blurInputGroup: function () {
    this.setState({
      focused: false,
      activated: this.state.filterText !== ""
    });
  },

  getTdClasses: function (key) {
    var sortKey = this.state.sortKey;

    return classNames(
      "overflow-ellipsis",
      {"cell-highlighted": sortKey === key}
    );
  },

  render: function () {
    var state = this.state;
    var totalUsedCpu = this.state.total.stats && this.state.total.stats.cpu_pct;
    var totalUsedRam = this.state.total.stats && this.state.total.stats.ram_pct;
    var totalAgents = this.state.agents.length;

    var searchIconClassSet = classNames("icon ion-search", {
      clickable: this.state.query !== ""
    });
    var filterBoxClassSet = classNames({
      "input-group": true,
      "filter-box": true,
      "filter-box-activated": !!this.state.activated,
      "space-margin": true
    });

    var headerClassSet = classNames({
      clickable: true,
      dropup: !state.sortDescending
    });

    return (
      <div>
        <div className="sub-header-total">
            <span className="used-total">
            Total: {totalAgents} / CPU: {totalUsedCpu}% - RAM: {totalUsedRam}%
            </span>
          <div className={`${filterBoxClassSet} search-input`}>
            <span className="input-group-addon" />
            <input
              className="form-control"
              onBlur={this.blurInputGroup}
              onChange={this.handleFilterTextChange}
              onFocus={this.focusInputGroup}
              onKeyDown={this.handleKeyDown}
              placeholder="Filter your agents"
              type="text"
              ref="filterText"
              value={this.state.filterText}
            />
            <span className="input-group-addon search-icon-container">
              <i className={searchIconClassSet} onClick={this.handleSubmit} />
            </span>
          </div>
          <button
            className="btn btn-xs btn-danger btn-settings button-filter"
            onClick={this.handleClick}
          >
            Clear filter
          </button>
        </div>
        <table className="table deployments">
          <colgroup>
            <col style={{width: "46%"}} />
            <col style={{width: "8%"}} />
            <col style={{width: "12%"}} />
            <col style={{width: "18%"}} />
            <col style={{width: "6%"}} />
            <col style={{width: "10%"}} />
          </colgroup>
          <thead>
            <tr>
              <th className={this.getTdClasses("hostname")}>
                <span
                  onClick={this.sortBy.bind(null, "hostname")}
                  className={headerClassSet}
                >
                  Hostname
                  {this.getCaret("hostname")}
                </span>
              </th>
              <th className={this.getTdClasses("total_apps")}>
                <span
                  onClick={this.sortBy.bind(null, "total_apps")}
                  className={headerClassSet}
                >
                  Apps {this.getCaret("total_apps")}
                </span>
              </th>
              <th className={this.getTdClasses("cpu_pct")}>
                <span
                  onClick={this.sortBy.bind(null, "cpu_pct")}
                  className={headerClassSet}
                >
                  CPU(ocupado/total) {this.getCaret("cpu_pct")}
                </span>
              </th>
              <th className={this.getTdClasses("ram_pct")}>
                <span
                  onClick={this.sortBy.bind(null, "ram_pct")}
                  className={headerClassSet}
                >
                  RAM(ocupado/total)
                  {this.getCaret("ram_pct")}
                </span>
              </th>
              <th className={this.getTdClasses("type")}>
                <span
                  onClick={this.sortBy.bind(null, "type")}
                  className={headerClassSet}
                >
                  Type
                  {this.getCaret("type")}
                </span>
              </th>
              <th className={this.getTdClasses("version")}>
                <span
                  onClick={this.sortBy.bind(null, "version")}
                  className={headerClassSet}
                >
                  Agent Version
                  {this.getCaret("version")}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>{this.getAgentsNodes()}</tbody>
        </table>
        {this.getInlineDialog()}
      </div>
    );
  }
});

export default SlaveListComponent;
