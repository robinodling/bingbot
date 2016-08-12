
'use strict'

const _ = require('lodash')

const config = require('./config')

const pg = require('pg')
const client = new pg.Client(config('DATABASE_URL'))

function bing_sql(uid, quantity, article) {
  client.query('insert into bing ("uid", "timestamp", "quantity", "article") values ($1, now(), $2, $3)', 
    [uid, quantity, article], 
    function (err, res) {
      if (err) throw err
      
      client.end(function (err) {
        if (err) throw err
      })
    }
  )
}

function binga(bot, uid, quantity, article) {
  client.connect(function (err) {
    if (err) throw err
    
    client.query('select uid from users where uid=$1', [uid], function (err, res) {
      if (err) throw err
      
      if (res.rowCount==0) {
        bot.api.users.info({
          user: uid
        }, function(err, res) {
          if (err) throw err
          
          if (res.ok == true) {
            let uid        = res.user.id
            let nick       = res.user.name
            let email      = res.user.profile.email
            let first_name = res.user.profile.first_name
            let last_name  = res.user.profile.last_name
            
            client.query('insert into users values ($1, $2, $3, $4, $5)', 
              [uid, 
               nick,
               email,
               first_name,
               last_name],
              function (err, res) {
                if (err) throw err
                
                bing_sql(uid, quantity, article)
              }
            )
          }
        })
      }
      else {
        bing_sql(uid, quantity, article)
      }
    })
  })
}

module.exports = (bot, uid, quantity, article) => {
  binga(bot, uid, quantity, article)
}
