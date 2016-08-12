
'use strict'

const _ = require('lodash')

const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.load()

const config = {
  ENV:         process.env.NODE_ENV,
  PORT:        process.env.PORT,
  PROXY_URI:   process.env.PROXY_URI,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  DATABASE_URL:process.env.DATABASE_URL,
  ICON_EMOJI:  ':beer'
}

module.exports = (key) => {
  if (!key) return config

  return config[key]
}
