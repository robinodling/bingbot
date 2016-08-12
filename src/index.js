
'use strict'

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
  binga(bot, message.user, message.match['1'], message.match['2'])
  
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'beer'
  }, function(err, res) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(', err)
    }
  })
});



controller.setupWebserver(config('PORT'),function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver)
});
