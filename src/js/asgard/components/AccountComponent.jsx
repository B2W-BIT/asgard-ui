import React from "react/addons";
import classNames from "classnames";
import PopoverComponent from "./PopoverComponent";
import UserActions from "../actions/UserActions";
import AccountActions from "../actions/AccountActions";
import OnClickOutsideMixin from "react-onclickoutside";
import UserStore from "../stores/UsersStore";
import UserEvents from "../events/UserEvents";
import AccountsStore from "../stores/AccountsStore";
import Bridge from "../../helpers/Bridge";
import AccountsEvents from "../events/AccountsEvents";
import _ from "underscore";

var AccountComponent = React.createClass({
  displayName: "AccountComponent",

  contextTypes: {
    router: React.PropTypes.func
  },

  mixins: [OnClickOutsideMixin],

  getInitialState: function () {
    var users = UserStore.users;
    var currents = UserStore.users.current_account;
    var accountList = UserStore.users.accounts;
    return {
      users: users,
      profileMenuVisible: false,
      collapse: false,
      currentAccount: currents,
      listAccounts : accountList,
    };
  },

  componentWillMount: function () {
    UserActions.requestUser();
    UserStore.on(UserEvents.CHANGE, this.onRequestUser);
    AccountsStore.on(AccountsEvents.CHANGE, this.onRequestAccounts);
  },

  componentWillUnmount: function () {
    UserStore.removeListener(UserEvents.CHANGE,
      this.onRequestUser);
    AccountsStore.removeListener(AccountsEvents.CHANGE,
      this.onRequestAccounts);
  },

  onRequestUser: function () {
    this.setState( {
      users : UserStore.users,
      currentAccount : UserStore.users.current_account,
      listAccounts: UserStore.users.accounts,
    });
  },

  onRequestAccounts: function () {
    Bridge.navigateTo("/#/apps");
    AccountsStore.emit(AccountsEvents.NEW_ACCOUNT);
  },

  handleClickOutside: function () {
    this.setState({
      profileMenuVisible: false
    });
  },

  toggleHelpMenu: function () {
    this.setState({
      profileMenuVisible: !this.state.profileMenuVisible,
    });
  },

  handleClick: function (event) {
    this.setState({collapse: !this.state.collapse});
    event.stopPropagation();
  },

  handleClickToken : function (accountClick, accounts, current) {
    AccountActions.requestToken(accountClick.id);
    const accountsList = accounts;
    accountsList.push(current);
    const accountsAppend = accountsList.filter(list => {
      return list.id !== accountClick.id;
    });
    const orderField = "name";
    const sortedObjs = _.sortBy( accountsAppend, orderField);
    this.setState({
      listAccounts: sortedObjs,
      currentAccount: accountClick,
    });
  },

  listAccounts: function (current) {
    const accounts = this.state.listAccounts;
    if (accounts && accounts.length > 0) {
      return (
        <div>
          <span className="caret align-icon"></span>
          <PopoverComponent visible={this.state.profileMenuVisible}
              className="help-menu-dropdown">
            <ul className="dropdown-menu">
              {accounts && accounts.map(account => {
                return (
                  <li key={account.id}>
                    <a
                      onClick={() =>
                      this.handleClickToken(account, accounts, current)}
                    >
                      {account.name}
                    </a>
                  </li>
                );
              })
              }
            </ul>
          </PopoverComponent>
        </div>
    );
    }
  },

  render: function () {
    const myAccounts = this.state.users && this.state.users.accounts;
    const current = this.state.currentAccount;
    var helpMenuClassName = classNames("help-menu", {
      "active": this.state.helpMenuVisible
    });

    return (
      <div className={helpMenuClassName} className = "accountPopover"
        onClick={() => this.toggleHelpMenu(myAccounts)}>
        <span className="nameAccountCurrent">
          {current && current.name}
        </span>
          {this.listAccounts(current)}
      </div>
    );
  }
});

export default AccountComponent;
