
'use strict'

const _ = require('lodash')

const config = require('./config')
const pgp = require('pg-promise')();

const cn = {
  host: config('PGHOST'),
  port: config('PGPORT'),
  database: config('PGDATABASE'),
  user: config('PGUSER'),
  password: config('PGPASSWORD'),
  poolSize: config('PGPOOLSIZE'),
  ssl: config('PGSSL')
}

const db = pgp(config.DATABASE_URL)

function bing_sql(bot, message) {
  
  var uid = message.user
  var quantity = message.match['1']
  var article = message.match['2']

  db.none("insert into bing (uid, timestamp, quantity, article) values ($1, now(), $2, $3)", [uid, quantity, article])
    .then(function() {
      //Success
      console.log("Successfully added bing " + article + " with quantity " + quantity)
      send_emoji(bot, message)
    })
    .catch(function(error) {
      console.log("Something went wrong when inserting new bing!");
      console.log("ERROR:", error.message || error);
    });
  
}

function send_emoji(bot, message){
  bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'beer'
    }, function(err, res) {
      if (err) {
        bot.botkit.log('Failed to add emoji reaction :(', err)
      }
    })
}


function binga(bot, message) {

  var uid = message.user
  var quantity = message.match['1']
  var article = message.match['2']

db.oneOrNone("select uid from users where uid=$1", [uid])
      .then(function(data) {

        if (data === null){
          //Could not fetch user. Create user
          console.log("Could not find user with uid " + uid)
          //Fetch user info
          bot.api.users.info({
            user: uid
          }, function(err, res) {
            if (err) throw err

            if(res.ok === true) {

              //If user could be fetched from slack, insert
              db.none("insert into users values ($1, $2, $3, $4, $5)", 
                [res.user.id, 
                res.user.name, 
                res.user.profile.email, 
                res.user.profile.first_name, 
                res.user.profile.last_name]
              )
              .then(function() {
                //Success
                console.log("Successfully inserted user " + res.user.name + " with real name " + res.user.profile.first_name + " " + res.user.profile.last_name)
                bing_sql(bot, message)
              })
              .catch(function(error) {
                console.log("Something went wrong when inserting new user!");
                console.log("ERROR:", error.message || error);
              });
            }
          })
          
        }else{
          
          bing_sql(bot, message)
        }

        //Success
        console.log("Successfully fethched user with uid " + uid)
      })
      .catch(function(error) {
        console.log("Something went wrong when selecting user!\n");
        console.log("ERROR:", error.message || error);
      });
}

module.exports = (bot, uid, quantity, article) => {
  binga(bot, uid, quantity, article)
}
