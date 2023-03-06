import React, { useEffect, useRef } from "react"
import './App.css'

class Word {
    constructor(text) {
        this.text = text
        this.speed = (Math.random() + 1)
        this.x = 1280
        this.y = Math.floor(Math.random() * 680 - 50) + 60
        this.matched = false
    }
}

const wordList = [
    'hola',
    'chao',
    'como',
    'estas',
    'paralelepipedo',
    'paranga',
    'test',
    'probando',
]

const words = []

let word = ''

function spawn() {
    words.push(new Word(wordList[Math.floor(Math.random() * wordList.length)]))
}

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 */
function init(context) {
    setInterval(() => draw(context), 16)
    document.addEventListener('keydown', input)
    setInterval(spawn, 3000);
}

/**
 * 
 * @param {CanvasRenderingContext2D} context 
 */
function draw(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    words.forEach(w => {
        context.font = '30px Arial'
        if (w.matched) {
            const matchedSize = context.measureText(word)
            const unmatchedText = w.text.slice(word.length)
            context.fillStyle = 'red'
            context.fillText(word, w.x, w.y)
            context.fillStyle = 'black'
            context.fillText(unmatchedText, w.x + matchedSize.width, w.y)
        } else {
            context.fillText(w.text, w.x, w.y)
        }
        w.x -= w.speed
    })
}

let deleted = false

/**
 * 
 * @param {KeyboardEvent} event 
 */
function input(event) {
    word += event.key
    let matched = words.filter(w => w.text.startsWith(word))

    if (matched.length == 0) {
        word = event.key
    }

    matched = words.filter(w => w.text.startsWith(word))

    const unmatched = words.filter(w => !matched.includes(w))
    unmatched.forEach(w => {
        w.matched = false
    })

    for (const w of matched) {
        w.matched = true
        if (w.text == word) {
            var index = words.indexOf(w);
            if (index !== -1) {
                words.splice(index, 1);
                deleted = true
                break;
            }
        }
    }

    if (deleted) {
        word = ''
    }

    deleted = false
    console.log(word)
    console.log(matched)
}


export default function App() {
    const canvasRef = useRef();

    useEffect(() => {
        init(canvasRef.current.getContext('2d'))
    }, [])

    return (
        <canvas id="canvas" width={1280} height={720} ref={canvasRef}></canvas>
    )
}