const minimist = require('minimist')

class Input {
  constructor () {
    const args = minimist(process.argv.slice(2))
    this.command = this.parseInput(args)
  }

  parseInput (args) {
    const validArgs = {
      create: 'create',
      read: 'read',
      update: 'update',
      delete: 'delete'
    }

    const allCommands = Object.keys(args)
    const command = allCommands.filter(arg =>
      validArgs[arg])[0]

    return {
      action: validArgs[command],
      payload: typeof args[command] === 'string'
        ? args[command] : undefined,
      category: args.category,
      text: args.text
    }
  }
}

module.exports = Input
