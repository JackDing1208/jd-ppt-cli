#!/usr/bin/env node

const yargs = require("yargs")
const ppt = require("./ppt")


const argv = yargs.argv;
const commands = argv._

ppt(commands,argv)
