"use strict";

const express = require('express');
const router  = express.Router();
const smsDialler = require('./util/smsDialler');


module.exports = (knex) => {
  router.post( '/sms/sendpoll', (req, res) => {
    const phoneNumber = req.body["phone-number"];
    const privateKey = req.body.private_key;
    console.log( privateKey );
    var smsPoll = "";
    var pollID;

    knex
      .select( "question", "title", "public_key", "polls.id" )
      .from( "polls" )
      .join( "choices", "polls.id", "choices.poll_id" )
      .where( "private_key", privateKey )
      .then((results) => {
        if (results.length) {
          smsPoll += results[0].question;
          smsPoll += "\nInclude " + results[0].public_key.slice(0, 4) + " at the start of your sms";
          for( var i = 0; i < results.length; i++ ) {
            smsPoll += "\n" + (Number(i)+1) + " " + results[i].title;
          }
          if( smsPoll.length > 1600 ) {
            smsPoll = smsPoll.slice( 0, 1600 );
          }
        }

        smsDialler( phoneNumber, smsPoll );

        pollID = results[0]["polls.id"];
        knex
          .select("id")
          .from("phone_numbers")
          .where("phone_number", phoneNumber)
          .then((rows) => {
            if( rows.length ) { //for obeying the uniqueness of phone_numbers
              return null;
            }
            else {
              var temp = knex( "phone_numbers" )
                .insert( {phone_number: phoneNumber} )
                .returning( "phone_numbers.id" );
              console.log( "phone number", temp );
              return temp;
            }
          });
      }).then((rows) => {
        console.log( "returned phone id rows: ", rows );
        if( rows ){
          knex( "polls_to_phone_numbers" )
            .insert( {phone_number_id: rows[0], poll_id: pollID} );
        }
        res.end('ADMIN PAGE');
      });

  });
  return router;
};
