const express = require('express');
const asyncMiddleware = require('../Middlewares/async');

class RouterServiceProvider {
  $name = undefined;
  $router = null;

  constructor (app) {
    // this.$name = name;
    this.$router = express.Router();

    app.registerRouter(this.$router);

    return new Proxy(this, {
      get(target, name) {
        if (target[name]) {
          return target[name];
        }

        return target.$router[name];
      }
    })
  }

  promisefyActions = function (actions) {
    return actions.map(action => {
      if (action[Symbol.toStringTag] === 'AsyncFunction') {
        return asyncMiddleware(action);
      }

      return action;
    });
  }

  get(url, ...actions){
    const promisefiedActions = this.promisefyActions(actions);

    this.$router.get(url, ...promisefiedActions);
  }
  
  post(url, ...actions){
    const promisefiedActions = this.promisefyActions(actions);

    this.$router.post(url, ...promisefiedActions);
  }

  put(url, ...actions){
    const promisefiedActions = this.promisefyActions(actions);

    this.$router.put(url, ...promisefiedActions);
  }

  delete(url, ...actions){
    const promisefiedActions = this.promisefyActions(actions);

    this.$router.delete(url, ...promisefiedActions);
  }
}

module.exports = RouterServiceProvider;
