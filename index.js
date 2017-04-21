import paper from "paper"
import fabric from "fabric"
const f = fabric.fabric

const figureBtnActiveClass = 'figure-btn-active'

const canvas = new f.Canvas('canvas');

const figureBtns = document.getElementsByClassName('figure-buttons')[0]
const circleBtn = document.getElementsByClassName('circle')[0]
const rectangleBtn = document.getElementsByClassName('rectangle')[0]
const lineBtn = document.getElementsByClassName('line')[0]

circleBtn.draw = (x, y) => {
    console.log(`circle: ${x} ${y}`)
}

rectangleBtn.draw = (x, y) => {
    console.log(`rectangle: ${x} ${y}`)
    const rect = new f.Rect({
        left: x,
        top: y,
        fill: 'red',
        width: 20,
        height: 20
    });
    canvas.add(rect);
}

lineBtn.draw = (x, y) => {
    console.log(`line: ${x} ${y}`)
}

let currentFigure = lineBtn
currentFigure.classList.add(figureBtnActiveClass)

Array.from(figureBtns.children).forEach(child => {
    child.addEventListener('click', () => {
        currentFigure.classList.remove(figureBtnActiveClass)
        currentFigure = child;
        currentFigure.classList.add(figureBtnActiveClass)
    })
})

canvas.on('mouse:down', ({e}) => {
    currentFigure.draw(e.x, e.y)
})


