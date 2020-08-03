const {logExpression} = require('@cisl/zepto-logger');
const appSettings = require('./appSettings');
const fetch = require('node-fetch');

function constructUrl(parts) {
  let url = `${parts.protocol ? parts.protocol : 'http'}://${parts.host ? parts.host : 'localhost'}`;
  if (parts.port) {
    url += `:${parts.port}`;
  }
  return url;
}

module.exports.postToService = async (service, route, data) => {
  logExpression(`post to ${service} on ${route}`, 2);
  logExpression(data, 2);
  if (!appSettings.serviceMap[service]) {
    throw new Error(`Unrecognized service: ${service}`)
  }

  const serviceUrl = constructUrl(appSettings.serviceMap[service]);

  if (route[0] !== '/') {
    route = '/' + route;
  }

  const res = await fetch(`${serviceUrl}${route}`, {
    method: 'post',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const body = await res.text();
  try {
    return JSON.parse(body);
  }
  catch (exc) {
    logExpression('Could not parse response');
    logExpression(body);
    //throw exc;
    return {}
  }
};

module.exports.getFromService = async (service, route) => {
  logExpression(`get from ${service} on ${route}`, 2);
  if (!appSettings.serviceMap[service]) {
    throw new Error(`Unrecognized service: ${service}`);
  }

  const serviceUrl = constructUrl(appSettings.serviceMap[service]);

  if (route[0] !== '/') {
    route = '/' + route;
  }

  const res = await fetch(`${serviceUrl}${route}`);
  const body = await res.text();
  try {
    return JSON.parse(body);
  }
  catch (exc) {
    logExpression('Could not parse response', 2);
    logExpression(body, 2);
    throw exc;
  }
}
