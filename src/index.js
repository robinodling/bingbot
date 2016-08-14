'use strict'

var http = require('http')
setInterval(function() {
	http.get("http://pirayabot.herokuapp.com")
	console.log('-------------SENDING GET TO PREVENT SLEEP-------------')
}, 300000)

const _ = require('lodash')

const config = require('./config')

const Botkit = require('botkit')

const binga = require('./bing')

let controller = Botkit.slackbot({
  debug: true
})

let bot = controller.spawn({
  token: config('SLACK_TOKEN')
});

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears('^(-?[0-9]+) (.*)', 'direct_message,direct_mention,mention', function(bot, message) {

  binga(bot, message)
  
});

controller.hears('.*', 'direct_message,direct_mention,mention', function(bot, message) {

  bot.reply(message, "Fan binga ordentligt. <ANTAL> <VAD DU BINGAR>.. Ska väll inte vara så jävla svårt!")
  
});

controller.setupWebserver(config('PORT'),function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver)
});
