import fabric from "fabric"
const f = fabric.fabric

const figureBtnActiveClass = 'figure-btn-active'

const canvas = new f.Canvas('canvas');
const figureBtns = document.getElementsByClassName('figure-buttons')[0]
const clearBtn = document.getElementsByClassName('clear')[0]

const circleBtn = document.getElementsByClassName('circle')[0]
const rectangleBtn = document.getElementsByClassName('rectangle')[0]
const lineBtn = document.getElementsByClassName('line')[0]
const starBtn = document.getElementsByClassName('star')[0]

const polylineBtn = document.getElementsByClassName('polyline')[0]
const polylineInput = document.getElementsByClassName('polyline-input')[0]
const moveBtn = document.getElementsByClassName('move')[0]

let defaultInputValue = polylineInput.value

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

polylineInput.addEventListener('change', () => {
    let value = polylineInput.value
    if (value < 2 || value > 50) {
        alert('Only from 2 to 50')
        polylineInput.value = 5
    }
})

// Draw figure handlers: START
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


// Line
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

starBtn.draw = (x, y, spikes=5, or=30, ir=60) => {
    console.log(`star: ${x} ${y}`)
    const rot = Math.PI / 2 * spikes
    const cx = or
    const cy = or
    const sweep = Math.PI / spikes
    const points = []
    let angle = 0

    Array(5).fill().map((_, i) => i * i).forEach((el) => {
        let x = cx + Math.cos(angle) * or
        let y = cy + Math.sin(angle) * or
        points.push({x, y})
        angle += sweep
        
        x = cx + Math.cos(angle) * ir
        y = cy + Math.sin(angle) * ir
        points.push({x, y})
        angle += sweep
    })

    const star = new f.Polygon(points, {
        stroke: 'blue',
        left: x,
        top: y,
        strokeWidth: 2,
        strokeLineJoin: 'bevil'
    }, false)
    canvas.add(star)
}

let polilinePoints = []
canvas.on('mouse:down', (o) => {
    if (currentFigure != polylineBtn || move) return
    if (polylineInput.value == 0) {
        polylineInput.value = defaultInputValue
        switchTo(circleBtn)
        canvas.on('mouse:down', canvasClicker)
        finallyDrawPolygon(polilinePoints)
        polilinePoints = []
    } else {
        polylineInput.value -= 1
        const pointer = canvas.getPointer(o.e);
        const origX = pointer.x;
        const origY = pointer.y;
        const circle = new f.Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 1,
            strokeWidth: 1,
            stroke: 'black',
            fill: 'white',
            selectable: true,
            originX: 'center', originY: 'center'
        });
        canvas.add(circle);
    }
})
// Polyline
polylineBtn.draw = (x, y) => {
    console.log(`polyline: ${x} ${y}`)
    defaultInputValue = polylineInput.value
    canvas.off('mouse:down', canvasClicker)
}

const finallyDrawPolygon = (points) => {

}

// Draw figure handlers: END

const switchTo = (el) => {
    currentFigure.classList.remove(figureBtnActiveClass)
    currentFigure = el;
    currentFigure.classList.add(figureBtnActiveClass)
    move = false
    moveBtn.classList.remove(figureBtnActiveClass)
}

Array.from(figureBtns.children).forEach(child => {
    child.addEventListener('click', () => {
        switchTo(child)
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

const canvasClicker = ({e}) => {
    if (move) return
    const coordinates = canvas.getPointer(e)
    currentFigure.draw(coordinates.x, coordinates.y)
}

canvas.on('mouse:down', canvasClicker)