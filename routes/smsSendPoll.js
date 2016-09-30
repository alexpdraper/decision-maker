"use strict";

const express = require('express');
const router  = express.Router();
const smsDialler = require('./util/smsDialler');

module.exports = (knex) => {
  router.post( '/sms/sendpoll', (req, res) => {
    const phoneNumber = req.params["phone-number"];
    const privateKey = req.params.private_key;
    var smsPoll = "";
    knex
      .select("question, title")
      .from("polls")
      .join("choices")
      .where("private_key", privateKey)
      .then((results) => {
        if (results.length) {
          smsPoll += results[0].question;
          for( var i = 0; i < results.length; i++ ) {
            smsPoll += "\n" + i + results[i].title;
          }
          if( smsPoll.length > 1600 ) {
            smsPoll = smsPoll.slice( 0, 1600 );
          }
          smsDialler( phoneNumber, smsPoll );
          res.end('ADMIN PAGE');
        }
      });
  });
  return router;
};
