const got = require('got');
const request = require('request');
const Buffer = require('Buffer');
const canonicalize = require('canon');
const crypto = require('crypto-js');
const companyCode = 88801;
const Oauth = require('client-oauth2');
const cID = '268b2069-b099-4fa2-8148-1f1c0327fe63';
const cS = 'b383c35d-3c11-4ce6-b631-8767f4c2084b';
const aK = '0dfb11cd-b140-40cd-b65a-220e9998a129';
const aS = '199505e4-9d5f-4ba9-bb96-a3ea8b2f69c1';

const auth = new Oauth({
  clientId: cID,
  clientSecret: cS,
  accessTokenUri: 'https://api.finhacks.id/api/oauth/token',
});

function getAccessToken (handleData) {

  let header = {
    Authorization: 'Basic ' + new Buffer(cID + ':' + cS).toString('base64'),
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  let body = { grant_type: 'client_credentials' };
  let options = {
    method: 'POST',
    url: 'https://api.finhacks.id/api/oauth/token',
    headers: header,
  };

  request.post(options).form(body)
    .on('response', function(response) {
      response.on('data', function(data){
        handleData(data);
      });
    })
    .on('error', function(error) {
      handleData(error);
    });
}


function createHeader (data, body){
  let method = 'post'.toUpperCase();
  let url = encodeURI('/ewallet/customers');
  let accessToken = data.accessToken;
  let bd = crypto.SHA256(canonicalize.stringify(body)).toString();
  bd.toLowerCase();
  let dt = new Date();
  dt = dt.toISOString();

  let str = method + ':' + url + ':' + accessToken + ':' + bd + ':' + dt;

  let hash = crypto.HmacSHA256(str, aS).toString();

  var header = {
    'Authorization' : 'Bearer '+accessToken,
    'X-BCA-Key' : aK,
    'X-BCA-Signature' : hash,
    'X-BCA-Timestamp' : dt
  }

  return header;
}

function registerUser (req, res) {
  let body = {};
  body.CustomerName = req.customer_name;
  body.DateOfBirth = req.birth_date;
  body.PrimaryID = req.primary_id;
  body.MobileNumber = req.mobile_number;
  body.EmailAddress = req.email_address;
  body.IDNumber = req.id_number;
  body.CompanyCode = companyCode;

  let header = {};

  getAccessToken(function(data){
    let header = createHeader(data, body);
    res.send(data);
    // res.send(header);
  });
}

module.exports = {
  getAccessToken,
  registerUser,
};
