import paper from "paper"
import fabric from "fabric"
const f = fabric.fabric

const figureBtnActiveClass = 'figure-btn-active'

const canvas = new f.Canvas('canvas');
const figureBtns = document.getElementsByClassName('figure-buttons')[0]
const clearBtn = document.getElementsByClassName('clear')[0]

const circleBtn = document.getElementsByClassName('circle')[0]
const rectangleBtn = document.getElementsByClassName('rectangle')[0]
const lineBtn = document.getElementsByClassName('line')[0]
const moveBtn = document.getElementsByClassName('move')[0]

const clearCanvas = () => {
    canvas.clear()
    canvas.backgroundColor = 'white'
    canvas.add();
}

// Initial setup
clearCanvas()
let currentFigure = circleBtn
currentFigure.classList.add(figureBtnActiveClass)
let move = false

// Draw figure handlers
circleBtn.draw = (x, y) => {
    console.log(`circle: ${x} ${y}`)
    const circle = new f.Circle({
        radius: 20, 
        fill: 'green', 
        left: x, 
        top: y
    });
    canvas.add(circle);
    canvas.deactivateAll().renderAll();
}

rectangleBtn.draw = (x, y) => {
    console.log(`rectangle: ${x} ${y}`)
    const rect = new f.Rect({
        left: x,
        top: y,
        fill: 'black',
        width: 20,
        height: 20
    });
    canvas.add(rect);
}

let line;
let isDown;
canvas.on('mouse:down', (o) => {
    if (currentFigure != lineBtn || move) return   
    isDown = true; 
    const pointer = canvas.getPointer(o.e);
    const points = [ pointer.x, pointer.y, pointer.x, pointer.y ];
    line = new f.Line(points, {
        strokeWidth: 5,
        fill: 'red',
        stroke: 'red',
        originX: 'center',
        originY: 'center'
    });
    canvas.add(line);
});

canvas.on('mouse:move', (o) => {
    if (currentFigure != lineBtn || move) return   
    if (!isDown) return;
    const pointer = canvas.getPointer(o.e);
    line.set({ x2: pointer.x, y2: pointer.y });
    canvas.renderAll();
});

canvas.on('mouse:up', (o) => {
    if (currentFigure != lineBtn || move) return   
    isDown = false;
});


lineBtn.draw = (x, y) => {
    console.log(`line: ${x} ${y}`)
}

Array.from(figureBtns.children).forEach(child => {
    child.addEventListener('click', () => {
        currentFigure.classList.remove(figureBtnActiveClass)
        currentFigure = child;
        currentFigure.classList.add(figureBtnActiveClass)
        move = false
        moveBtn.classList.remove(figureBtnActiveClass)
        console.log(moveBtn)
    })
})

clearBtn.addEventListener('click', () => {
    clearCanvas()
})

moveBtn.addEventListener('click', () => {
    move = true
    currentFigure.classList.remove(figureBtnActiveClass)
    moveBtn.classList.add(figureBtnActiveClass)
})

canvas.on('mouse:down', ({e}) => {
    if (move) return
    const coordinates = canvas.getPointer(e)
    currentFigure.draw(coordinates.x, coordinates.y)
})


