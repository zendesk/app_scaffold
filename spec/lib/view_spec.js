import View from "../../lib/javascripts/view";

describe("View", () => {
  it("can be constructed without arguments", function() {
    expect(new View().constructor).toBe(View);
  });

  describe("#renderTemplate", () => {
    it("should provide an assetURL helper in templates", () => {
      expect(Handlebars.helpers.assetURL).toBeDefined();
      expect(Handlebars.helpers.assetURL("foo.js")).toEqual("./foo.js");
    });
  });
});
