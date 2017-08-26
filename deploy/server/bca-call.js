const got = require('got');

const request = require('request');
const rp = require('request-promise');
const Buffer = require('Buffer');
const canonicalize = require('canon');
const crypto = require('crypto-js');
const companyCode = 88859;
const Oauth = require('client-oauth2');
const cID = '69c4c406-0ebf-4458-a4ea-9ced54e02311';
const cS = '282828c5-153a-4547-9ee5-3c43497dc0e2';
const aK = 'e3b3f613-17ce-4997-9ce8-fec989268765';
const aS = '18c837cb-b6d3-47cc-9f88-ab0caf2b8d9e';

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

function createSignature (method, url, data, accessToken, timestamp) {
  let m = method.toUpperCase();
  let u = encodeURI(url);
  let a = accessToken;
  let bd = "";
  if (Object.keys(data).length != 0 && data.constructor === Object) {
    bd = JSON.stringify(data).replace(/\s/g,'').replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,'');
  }
  console.log(bd);
  bd = crypto.SHA256(bd).toString().toLowerCase();

  let signature = crypto.HmacSHA256(m + ':' + u + ':' + a + ':' + bd + ':' + timestamp, aS).toString();

  return signature;
}

function createHeader (method, url, data, accessToken, timestamp) {
  let t  = timestamp + '+07:00';
  let signature = createSignature(method, url, data, accessToken, t);
  let header = {
    'Authorization': 'Bearer ' + accessToken,
    'X-BCA-Key': aK,
    'X-BCA-Signature': signature,
    'X-BCA-Timestamp': t,
  };
  return header;
}

// function createHeader (data, body){
  //   let method = 'post'.toUpperCase();
  //   console.log(method);
  //   let url = encodeURI('/ewallet/customers');
  //   console.log(url);
  //   let accessToken = data.access_token;
  //   console.log('access_token : '+accessToken);
  //   let bd = "";
  //   if(Object.keys(body).length != 0 && body.constructor === Object){
  //     bd = JSON.parse(JSON.stringify(body).replace(/\s/g,'').replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,''));
  //     console.log('body-canon :'+bd);
  //     bd = crypto.SHA256(bd).toString();
  //     console.log('body-sha256:'+bd);
  //   }
  //   bd.toLowerCase();
    
  //   let dt = new Date();
  //   dt = dt.toISOString().slice(0, -1);
  //   console.log(dt);
  //   let str = method + ':' + url + ':' + accessToken + ':' + bd + ':' + dt;
  //   console.log('combine :'+str);
  //   let hash = crypto.HmacSHA256(str, aS).toString();
  //   console.log('signature :'+hash);
  //   var header = {
  //     'Authorization' : 'Bearer '+accessToken,
  //     'X-BCA-Key' : aK,
  //     'X-BCA-Signature' : hash,
  //     'X-BCA-Timestamp' : dt
  //   }
  //   console.log(header);
  //   return header;
// }

function registerUser (req, res) {
  let bd = {};
  bd.CustomerName = req.body.customer_name;
  bd.DateOfBirth = req.body.birth_date;
  bd.PrimaryID = req.body.primary_id;
  bd.MobileNumber = req.body.mobile_number;
  bd.EmailAddress = req.body.email_address;
  bd.IDNumber = req.body.id_number;
  bd.CompanyCode = companyCode;
  bd.CustomerNumber = "1111111112";

  getAccessToken(function(data){
    let method = 'POST';
    let host = 'https://api.finhacks.id';
    let url = '/ewallet/customers';
    let access_token = JSON.parse(data).access_token;
    let timestamp = new Date().toISOString();
    let header = createHeader(method, url, bd, access_token, timestamp);

    let options = {
      url: host + url,
      headers: header,
      method: method,
      body: bd,
      json: true,
    };

    rp(options)
      .then(function (response) {
        res.send(response);
      })
      .catch(function (error) {
        res.send(error);
      });
  });
}

function getUser (req, res) {
  let bd = {};
  bd.CompanyCode = 88859;
  bd.PrimaryID = req.params.id;
  
  getAccessToken(function (data) {
    let method = 'GET';
    let host = 'https://api.finhacks.id';
    let url = '/ewallet/customers/' + bd.CompanyCode + '/' + bd.PrimaryID;
    let access_token = JSON.parse(data).access_token;
    let timestamp = new Date().toISOString();
    let header = createHeader(method, url, bd, access_token, timestamp);

    let options = {
      url: host + url,
      headers: header,
      method: method,
      json: true,
    };

    rp(options)
      .then(function (response) {
        res.send(response);
      })
      .catch(function (error) {
        res.send(error);
      });
  });
}

// function solveSignature(res){
  //   let method = 'POST'.toUpperCase();
  //   let url = encodeURI('/banking/corporates/transfers');
  //   console.log(url);
  //   let access_token = 'lIWOt2p29grUo59bedBUrBY3pnzqQX544LzYPohcGHOuwn8AUEdUKS';
  //   let body = 
  //   { 
  //       "CorporateID" : "BCAAPI2016",
  //       "SourceAccountNumber" : "0201245680",
  //       "TransactionID" : "00000001",
  //       "TransactionDate" : "2016-01-30",
  //       "ReferenceID" : "12345/PO/2016",
  //       "CurrencyCode" : "IDR",
  //       "Amount" : "100000.00",
  //       "BeneficiaryAccountNumber" : "0201245681",
  //       "Remark1" : "Transfer Test",
  //       "Remark2" : "Online Transfer"
  //   };
  //   let dt = '2016-02-03T10:00:00.000+07:00';
  //   let apiSecret = '22a2d25e-765d-41e1-8d29-da68dcb5698b';
  //   let bd = JSON.stringify(body).replace(/\s/g,'').replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,'');
  //   console.log(JSON.stringify(bd));
  //   bd = crypto.SHA256(bd).toString();
  //   console.log(bd);
  //   let str = method + ':' + url + ':' + access_token + ':' + bd + ':' + dt;
  //   console.log(str);
  //   let hash = crypto.HmacSHA256(str, apiSecret).toString();
  //   console.log(hash);
// }

module.exports = {
  getAccessToken,
  registerUser,
  getUser,
};
