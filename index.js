var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: true
});

var bot = controller.spawn({
  token: "xoxb-68525150336-ZOs922aITp1c4EBDs3tJLiwL"
});

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears(['öhl', 'öl', '([0-9]+) öl', '([0-9]+) öhl'], 'direct_message,direct_mention,mention', function(bot, message) {
  
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'beer'
  }, function(err, res) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(', err);
    }
  });
  
  setTimeout(function() {
    bot.reply(message, 'Eller nej, bingstopp!');
  }, 700);

});

controller.setupWebserver(process.env.port,function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver);
});
