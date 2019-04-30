import React from "react";
import Util from "../helpers/Util";

var MenuItemComponent = React.createClass({
  "displayName": "MenuItemComponent",

  propTypes: {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    selected: React.PropTypes.bool,
    value: React.PropTypes.string.isRequired
  },

  getInitialState:  function () {
    return {
      id: "menu-item-" + Util.getUniqueId()
    };
  },

  render: function () {
    var {
      children,
      className,
      name,
      value,
      selected
    } = this.props;

    var {id} = this.state;

    return (
      <li role="menu-item" className={className}>
        <input id={id} type="radio" name={name} value={value}
          checked={selected}
          readOnly />
        <label htmlFor={id}>
          {children}
        </label>
      </li>
    );
  }
});

export default MenuItemComponent;
