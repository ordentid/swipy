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


function createHeader (data, body){
  let method = 'post'.toUpperCase();
  console.log(method);
  let url = encodeURI('/ewallet/customers');
  console.log(url);
  let accessToken = data.access_token;
  console.log('access_token : '+accessToken);
  let bd = "";
  if(Object.keys(body).length != 0 && body.constructor === Object){
    bd = JSON.parse(JSON.stringify(body).replace(/\s/g,'').replace(/\r/g,'').replace(/\n/g,'').replace(/\t/g,''));
    console.log('body-canon :'+bd);
    bd = crypto.SHA256(bd).toString();
    console.log('body-sha256:'+bd);
  }
  bd.toLowerCase();
  
  let dt = new Date();
  dt = dt.toISOString();
  console.log(dt);
  let str = method + ':' + url + ':' + accessToken + ':' + bd + ':' + dt;
  console.log('combine :'+str);
  let hash = crypto.HmacSHA256(str, aS).toString();
  console.log('signature :'+hash);
  var header = {
    'Authorization' : 'Bearer '+accessToken,
    'X-BCA-Key' : aK,
    'X-BCA-Signature' : hash,
    'X-BCA-Timestamp' : dt
  }
  console.log(header);
  return header;
}

function registerUser (req, res) {

  let bd = {};
  bd.CustomerName = req.body.customer_name;
  bd.DateOfBirth = req.body.birth_date;
  bd.PrimaryID = req.body.primary_id;
  bd.MobileNumber = req.body.mobile_number;
  bd.EmailAddress = req.body.email_address;
  bd.IDNumber = req.body.id_number;
  bd.CompanyCode = companyCode;
  bd.CostumerNumber = "1111111112";
  let header = {};

  getAccessToken(function(data){
    let header = createHeader(JSON.parse(data), bd);
    let options = {
      url: 'https://api.finhacks.id/ewallet/customers',
      headers: header,
      method: 'POST',
      body: bd,
      json: 'true',
    };

    rp(options)
      .then(function(response) {
        res.send(response);
      })
      .catch(function(error){
        res.send(error);
      });

    // request.post(options)
    //   .on('response',function(response){
    //     response.on('data', function(data){
    //       res.send(data);
    //     })
    //   })
    //   .on('error', function(error){
    //     res.send(error);
    //   });
  });
}

module.exports = {
  getAccessToken,
  registerUser,
};
