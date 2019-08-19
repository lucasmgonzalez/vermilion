const express = require('express');
const asyncMiddleware = require('./Middlewares/async');

const server = express();

class Server {
  $server = null;
  
  constructor () {
    this.$server = express();

    this.$router = express.Router;
  }

  registerRouter(prefix, router) {
    if (!router) {
      this.$server.use(prefix); // router was passed as first parameter
    } else {
      this.$server.use(prefix, router);
    }
  }

  registerMiddleware(url, middleware) {
    if (!middleware) {
      this.$server.use(url); // middleware as first parameter
    } else {
      this.$apserverp.use(url, middleware);
    }
  }

  listen(port, callback) {
    this.$server.listen(port, callback);
  }
  
  promisefyActions = function (actions) {
    return actions.map(action => {
      if (action instanceof Promise) {
        return asyncMiddleware(action);
      }

      return action;
    });
  }

  get(url, ...actions){
    const promisefiedActions = this.promisefyActions(actions);

    this.$server.get(url, ...promisefiedActions);
  }
  
  post(url, ...actions){
    const promisefiedActions = this.promisefyActions(actions);

    this.$server.post(url, ...promisefiedActions);
  }

  put(url, ...actions){
    const promisefiedActions = this.promisefyActions(actions);

    this.$server.put(url, ...promisefiedActions);
  }

  delete(url, ...actions){
    const promisefiedActions = this.promisefyActions(actions);

    this.$server.delete(url, ...promisefiedActions);
  }
}
module.exports = Server;
