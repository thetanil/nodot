const {
  unlinkSync, lstatSync, mkdirSync, existsSync,
  symlinkSync, readdirSync, renameSync
} = require('fs')
const { join, resolve, basename } = require('path')
const { log } = console
const pjson = require('./package.json')

log('nodot v' + pjson.version)

const userHome = resolve(process.env.HOME)
const nodotHome = resolve(join(__dirname, 'home'))
const bakDirName = 'bak.' + Date.now()
const nodotBak = resolve(join(__dirname, bakDirName))

const isNotNodotDir = (path) => {
  return !path.match(/\.git$/) &&
    !path.match(/node_modules/g) &&
    !path.match(/test$/)
}

const dirs = (path) => {
  return readdirSync(resolve(path))
    .map((direntry) => resolve(join(path, direntry)))
}

const dotify = (str) => {
  return str.replace(/^_/, (s) => {
    return '.' + s.substr(1)
  })
}

const clearPath = (path) => {
  if (lstatSync(path).isSymbolicLink()) {
    log(`rm: ${path} (just a link)`)
    unlinkSync(path)
  } else {
    log('mv:', path, resolve(join(nodotBak, basename(path))))
    renameSync(path, resolve(join(nodotBak, basename(path))))
  }
}

const ln = (src, dest) => {
  try {
    if (existsSync(dest)) {
      clearPath(dest)
    }
    if (existsSync(dest)) {
      throw new Error('EXIT: destination still exists:', dest)
    }
    log('ln:', src, dest)
    symlinkSync(src, dest)
  } catch (e) {
    log('TNERROR:', e)
    process.exit(1)
  }
}

const go = () => {
  if (!existsSync(nodotBak)) {
    mkdirSync(nodotBak)
  }

  readdirSync(nodotHome).forEach((entry) => {
    ln(join(nodotHome, entry), join(userHome, dotify(entry)))
  })
}

module.exports = {
  dotify,
  userHome,
  nodotHome,
  isNotNodotDir,
  go,
  dirs
}

go()
