// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const chalk = require('chalk')

function getRectangle(width, height) {
    const line = new Array(width).fill(' ').join('')

    return new Array(height).fill(line).join('\n')
}

function drawText(x, y, text) {
    const save = '\033[s'
    const restore = '\033[u'
    const up = n => '\033['+n+'A'
    const right = n => '\033['+n+'C'

    return `${save}${up(y)}${right(x)}${text}${restore}`
}

const topText = 'Stand with Ukraine'
const bottomText = 'Please check the Rete.js\'s README for details'

const top = chalk.bgBlue(getRectangle(50, 5))
const bottom = chalk.bgYellow(getRectangle(50, 5))


console.log(`${top}\n${drawText(16, 3, chalk.white.bgBlue(topText))}${bottom}\n${drawText(2, 3, chalk.black.bgYellow(bottomText))}`)
