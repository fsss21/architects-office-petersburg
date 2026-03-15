const fs = require('fs')
const path = require('path')

const imagesDir = path.join(__dirname, '..', 'public', 'data', 'images')

const newNames = {
  1: '1_medny_vsadnik.jpg',
  2: '2_golova_petra.jpg',
  3: '3_suvorov.jpg',
  4: '4_aleksandrovskaya_kolonna.jpg',
  5: '5_barklay.jpg',
  6: '6_kutuzov.jpg',
  7: '7_petr_kronshtadt.jpg',
  8: '8_kon_anichkov_ukrotitel.jpg',
  9: '9_kon_anichkov_gruppa.jpg',
  10: '10_nikolay_1.jpg',
  11: '11_nikolay_1_konnaya.jpg',
  12: '12_aleksandr_3.jpg',
  13: '13_steregushchiy.jpg',
}

const files = fs.readdirSync(imagesDir)
const byNumber = {}
files.forEach((name) => {
  const num = name.match(/^(\d+)/)
  if (num) {
    const n = parseInt(num[1], 10)
    if (!byNumber[n]) byNumber[n] = []
    byNumber[n].push(name)
  }
})

Object.keys(byNumber).forEach((key) => {
  const n = parseInt(key, 10)
  const newName = newNames[n]
  if (!newName) return
  const candidates = byNumber[n]
  const oldName = candidates.find((c) => c.endsWith('.jpg')) || candidates[0]
  if (oldName === newName) return
  const oldPath = path.join(imagesDir, oldName)
  const newPath = path.join(imagesDir, newName)
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath)
    console.log(`${oldName} -> ${newName}`)
  }
})
