const got = require('got');

const companyCode = 88801;
const Oauth = require('client-oauth2');
const auth = new Oauth({
  clientId: '268b2069-b099-4fa2-8148-1f1c0327fe63',
  clientSecret: 'b383c35d-3c11-4ce6-b631-8767f4c2084b',
  accessTokenUri: 'https://api.finhacks.id//api/oauth/token',
});

function getAccessToken () {
  auth.credentials.getTokenToken()
    .then(function (user) {
      return user;
    });
}

// function registerUser (req) {
//   let body = {};
  
//   body.CustomerName = req.customer_name;
//   body.DateOfBirth = req.birth_date;
//   body.PrimaryID = req.primary_id;
//   body.MobileNumber = req.mobile_number;
//   body.EmailAddress = req.email_address;
//   body.IDNumber = req.id_number;
//   body.CompanyCode = companyCode;

// }

module.exports = {
  getAccessToken,
};
