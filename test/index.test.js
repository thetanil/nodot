const { describe, it } = require('mocha')
const { assert } = require('chai')
const { log } = console
const { resolve, join } = require('path')
const nodot = require('./..')

log('')

describe('test', () => {
  it('should test', () => true)
})

describe('nodot', () => {
  it('should exist', () => {
    assert.isOk(nodot)
  })

  it('should dotify an underscrored name', () => {
    assert.equal(nodot.dotify('_asd'), '.asd')
    assert.equal(nodot.dotify('asd_asd'), 'asd_asd')
    assert.equal(nodot.dotify('._asd'), '._asd')
    assert.equal(nodot.dotify('_asd_'), '.asd_')
    assert.equal(nodot.dotify('__asd_'), '._asd_')
  })

  it('should get a list of dirs', () => {
    const parent = resolve(join(__dirname, '..'))
    const parentDirs = nodot.dirs(parent)
    assert.isOk(parentDirs)
    assert.equal(7, nodot.dirs(join(__dirname, '..', 'home')).length)
  })
})
