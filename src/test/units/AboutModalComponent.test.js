import {expect} from "chai";
import sinon from "sinon";
import {mount} from "enzyme";
import _ from "underscore";

import React from "react";
import AboutModalComponent
  from "../../js/components/modals/AboutModalComponent";
import InfoActions from "../../js/actions/InfoActions";
import InfoEvents from "../../js/events/InfoEvents";
import InfoStore from "../../js/stores/InfoStore";
import AppDispatcher from "../../js/AppDispatcher";

describe("About Modal", function () {
  var info;
  var component;
  before(function (done) {
    info = {
      "version": "1.2.3",
      "frameworkId": "framework1",
      "leader": "leader1.dcos.io",
      "marathon_config": {
        "marathon_field_1": "mf1",
        "marathon_field_2": "mf2"
      },
      "zookeeper_config": {
        "zookeeper_field_1": "zk1",
        "zookeeper_field_2": "zk2"
      }
    };

    sinon.stub(InfoActions, "requestInfo");
    component = mount(<AboutModalComponent destroy={_.noop} />);

    InfoStore.once(InfoEvents.CHANGE, () => {
      done();
    });

    AppDispatcher.dispatch({
      actionType: InfoEvents.REQUEST,
      data: {body: info},
    });
  });

  after(function () {
    component.instance().componentWillUnmount();
  });

  it("displays the current Marathon version", function () {
    expect(component.find(".modal-title").text()).to.equal("Version 1.2.3");
  });

  it("displays the current framework id", function () {
    expect(component.find(".modal-body").text()).to.contain("framework1");
  });

  it("displays the current leader", function () {
    expect(component.find(".modal-body").text()).to.contain("leader1.dcos.io");
  });

  it("displays the fields in the marathon config", function () {
    expect(component.find(".modal-body").text()).to.contain("mf1");
    expect(component.find(".modal-body").text()).to.contain("mf2");
  });

  it("displays the fields in the zookeeper config", function () {
    expect(component.find(".modal-body").text()).to.contain("zk1");
    expect(component.find(".modal-body").text()).to.contain("zk2");
  });

});
