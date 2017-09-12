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

   init() {
    this.zafClient.get(['instances']).then((data) => {
      this.renderMain(data);
    });
  },

  renderMain({ instances }) {
    const someGuid = Object.keys(instances)[0];
    this.switchTo("main", { guid: someGuid });
  },

  logClosedApp() {
    console.log("About to close the app.");
  }
};

export default BaseApp.extend(App);
