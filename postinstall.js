function getRectangle(width, height, color) {
    const line = new Array(width).fill(' ').join('')

    return new Array(height).fill(color(line)).join('\n')
}

function drawText(x, y, text) {
    const save = '\033[s'
    const restore = '\033[u'
    const up = n => '\033['+n+'A'
    const right = n => '\033['+n+'C'

    return `${save}${up(y)}${right(x)}${text}${restore}`
}

function black(text) {
    return '\x1b[30m' + text + '\x1b[0m'
}

function white(text) {
    return '\x1b[37m' + text + '\x1b[0m'
}

function bgBlue(text) {
    return '\x1b[44m' + text + '\x1b[0m'
}

function bgYellow(text) {
    return '\x1b[43m' + text + '\x1b[0m'
}

const topText = 'Stand with Ukraine'
const bottomText = 'Please check the Rete.js\'s README for details'

const top = getRectangle(50, 5, bgBlue)
const bottom = getRectangle(50, 5, bgYellow)

console.log(`${top}\n${drawText(16, 3, white(bgBlue(topText)))}${bottom}\n${drawText(2, 3, black(bgYellow(bottomText)))}`)
