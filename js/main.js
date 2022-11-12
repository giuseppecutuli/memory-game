import '../css/reset.css'
import '../css/style.css'

const settings = {
  rows: 4,
  columns: 4,
  emojis: ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍']
}

const state = {
  moves: 0,
  time: 0,
  matched: 0,
  pressedCard: undefined,
  lock: true,
  intervalTime: 0
}

const elements = {
  board: document.getElementById('board'),
  game: document.getElementById('game'),
  startBtn: document.getElementById('start-game'),
  resetBtn: document.getElementById('reset-game'),
  moves: document.getElementById('moves'),
  time: document.getElementById('time'),
  box: document.getElementById('box'),
  totalMoves: document.getElementById('totalMoves'),
  totalTime: document.getElementById('totalTime')
}

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

const updateMoves = () => {
  state.moves++
  elements.moves.textContent = state.moves
}

const updateTime = () => {
  state.time++
  elements.time.textContent = state.time
}

const checkHasWon = async () => {
  const totalMatches = (settings.columns * settings.rows) / 2
  if (state.matched === totalMatches) {
    clearInterval(state.intervalTime)
    elements.totalMoves.textContent = state.moves
    elements.totalTime.textContent = state.time
    state.lock = true
    await delay(1000)
    elements.board.classList.add('board--win')
  }
}

async function onClickBox() {
  if (state.lock) return
  if (this.classList.contains('box--visible')) return

  state.lock = true
  updateMoves()

  this.classList.add('box--visible')
  
  if (!state.pressedCard) {
    state.pressedCard = this
    state.lock = false
    return
  }

  const pressedEmoji = state.pressedCard.querySelector('.emoji').textContent
  const currentEmoji = this.querySelector('.emoji').textContent
  if (pressedEmoji !== currentEmoji) {
    await delay(1000)
    this.classList.remove('box--visible')
    state.pressedCard.classList.remove('box--visible')
    state.pressedCard = undefined
    state.lock = false
    return
  }
  state.matched++
  state.pressedCard = undefined
  state.lock = false
  checkHasWon()
}

const createBoard = () => {
  const numberOfItems = settings.rows * settings.columns
  const items = []
  for (let i = 0; i < numberOfItems / 2; i++) {
    const index = Math.floor(Math.random() * settings.emojis.length)
    items.push(index, index)
  }
  shuffleArray(items)

  const boxes = []
  for (let i = 0; i < numberOfItems; i++) {
    const box = elements.box.content.cloneNode(true)

    const emoji = box.querySelector('.emoji')
    emoji.textContent = settings.emojis[items[i]]

    const btn = box.querySelector('button')
    btn.addEventListener('click', onClickBox)

    boxes.push(box)
  }

  elements.game.replaceChildren(...boxes)
}

const start = () => {
  state.intervalTime = setInterval(updateTime, 1000)
  state.lock = false
  elements.startBtn.disabled = true
  elements.resetBtn.disabled = false
}

const reset = () => {
  clearInterval(state.intervalTime)
  state.time = -1
  updateTime()
  state.moves = -1
  updateMoves()
  state.matched = 0
  state.pressedCard = undefined
  state.lock = true
  createBoard()
  elements.board.classList.remove('board--win')
  elements.startBtn.disabled = false
  elements.resetBtn.disabled = true
}

const load = () => {
  const numberOfItems = settings.rows * settings.columns
  if (numberOfItems % 2 !== 0) {
    console.log('Error, the number of elements must be even')
    return
  }

  elements.startBtn.addEventListener('click', start)
  elements.resetBtn.addEventListener('click', reset)

  elements.game.style.gridTemplateColumns = `repeat(${settings.columns}, auto)`

  createBoard()
}

document.addEventListener('DOMContentLoaded', load)
