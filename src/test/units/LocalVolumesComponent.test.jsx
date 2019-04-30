import {expect} from "chai";
import {render, shallow} from "enzyme";

import React from "react";
import LocalVolumesComponent
  from "../../js/components/LocalVolumesComponent.jsx";

describe("Local Volumes Component", function () {
  describe("(no volume)", () => {
    var component = shallow(
      <LocalVolumesComponent errorIndices={{}}
        fields={{"localVolumes": null}}
        getErrorMessage={()=>{}}/>
    );

    it("should display a button", () => {
      expect(component.find("button")).to.have.length(1);
    });

    it("should have a button with type button", () => {
      expect(component.find("button").first().props().type).to.equal("button");
    });

    it("should have a button with the right text", () => {
      expect(component.find("button").first().props().children)
        .to.equal("Add a persistent local volume");
    });

    it("should have the right title", () => {
      expect(component.find("h4").first().props().children[0])
        .to.equal("Persistent Local Volumes");
    });
  });
  describe("(one volume)", () => {
    var component = render(
      <LocalVolumesComponent errorIndices={{}}
        fields={{"localVolumes": [{
          consecutiveKey: "0",
          containerPath: "",
          persistentSize: "1024"
        }]}}
        getErrorMessage={()=>{}}/>
    );

    it("should have the right size id", () => {
      expect(component.find("input").get(0).attribs.id)
        .to.equal("localVolumes.persistent.size.0");
    });

    it("should have the right size value", () => {
      expect(component.find("input").get(0).attribs.value)
        .to.equal("1024");
    });

    it("should have the right path id", () => {
      expect(component.find("input").get(1).attribs.id)
        .to.equal("localVolumes.containerPath.0");
    });

    it("should have the right path value", () => {
      expect(component.find("input").get(1).attribs.value)
        .to.equal("");
    });
  });

});
