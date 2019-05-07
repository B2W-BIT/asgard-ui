import React from "react/addons";
import classNames from "classnames";
import PopoverComponent from "./PopoverComponent";
import OnClickOutsideMixin from "react-onclickoutside";
import UserStore from "../stores/UsersStore";
import UserActions from "../actions/UserActions";
import UserEvents from "../events/UserEvents";
import Bridge from "../../helpers/Bridge";

var ConfigsComponent = React.createClass({
  displayName: "ConfigsComponent",

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [OnClickOutsideMixin],

  getInitialState: function () {
    var users = UserStore.users;
    return {
      users: users,
      helpMenuVisible: false,
      collapse: false,
    };
  },
  componentWillMount: function () {
    UserActions.requestUser();
    UserStore.on(UserEvents.CHANGE, this.onRequestUser);
  },

  componentWillUnmount: function () {
    UserStore.removeListener(UserEvents.CHANGE,
      this.onRequestUser);
  },

  onRequestUser: function () {
    this.setState( {
      users : UserStore.users,
    });
  },

  handleClickOutside: function () {
    this.setState({
      helpMenuVisible: false
    });
  },

  toggleHelpMenu: function () {
    this.setState({
      helpMenuVisible: !this.state.helpMenuVisible
    });
  },

  disconnectUser: function () {
    localStorage.setItem("auth_token", "");
    Bridge.navigateTo("/#/apps");
  },

  handleClick: function (event) {
    this.setState({collapse: !this.state.collapse});
    event.stopPropagation();
  },
  render: function () {
    const user = this.state.users && this.state.users.user;
    var helpMenuClassName = classNames("help-menu", {
      "active": this.state.helpMenuVisible
    });

    return (
      <div className={helpMenuClassName}
          onClick={this.toggleHelpMenu}>
        <i className="icon icon-mini settings"></i>
        <span className="caret"></span>
        <PopoverComponent visible={this.state.helpMenuVisible}
            className="help-menu-dropdown">
          <ul className="dropdown-menu">
            <li>
              <span>
                User: {user && user.name}
              </span>
            </li>
            <li>
              <a
                onClick={() => this.disconnectUser()}
                  target="_blank">
                Logout
              </a>
            </li>
          </ul>
        </PopoverComponent>
      </div>
    );
  }
});

export default ConfigsComponent;
