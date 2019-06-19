/* eslint-disable camelcase */
import {expect} from "chai";
import {shallow} from "enzyme";
import React from "react";

import TaskLogComponent from "../components/TaskLogComponent";

describe("Configs component", function () {

  before(function () {
    var task = {
      appId: "portal/api",
      id: "portal_api.3f83eca2-57b8-11e9-871a-0242a2cf0bf5",
      version: "1.4.1",
      slaveId: "4783cf15-4fb1-4c75-90fe-44eeec5258a7-S34",
      stagedAt: "2019-04-05T15:34:06.274000Z",
      startedAt: "2019-04-05T15:34:11.750000Z",
      state: "TASK_RUNNING",
      status: "Started",
      updatedAt: "2019-04-05T15:34:11.750000Z",
      version: "2019-04-05T15:34:06.112Z",
      healthStatus: "healthy",
      host: "10.234.168.31"
    };
    this.component = shallow(
      <TaskLogComponent task={task} logfile="/stdout" />
    );
  });

  it("has the icon image", function () {
    expect(
      this.component
        .find("div")
        .first()
        .hasClass("tab-pane")
    ).to.equal(true);
  });
});
