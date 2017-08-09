import BaseApp from "base_app";

// add these if needed
// import Base64 from 'base64';
// import helpers from 'helpers';

var App = {
  defaultState: "loading",

  requests: {
    getMe: {
      url: "/api/v2/users/me.json"
    }
  },

  events: {
    "app.created": "init",
    "app.willDestroy": "logClosedApp"
  },

  async init() {
    const data = await this.ajax("getMe");
    this.renderMain(data);
  },

  renderMain({ user }) {
    this.switchTo("main", user);
  },

  logClosedApp() {
    console.log("About to close the app.");
  }
};

export default BaseApp.extend(App);
