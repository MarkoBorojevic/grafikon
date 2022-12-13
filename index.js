
let func = null;
let scale = 1;

let offset = { x: -50, y: 50 };

let canvas = document.getElementById("graphic");
let ctx = canvas.getContext("2d");

const MAX_NUMBER_GAP = 40;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function DrawLines() {
    var horizontal = ConvertCoordinates(-ctx.canvas.width / 2, 0, ctx.canvas.width, ctx.canvas.height)
    var vertical = ConvertCoordinates(0, ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height)

    ctx.fillRect(vertical.x, vertical.y -offset.y, 1, ctx.canvas.height);
    ctx.fillRect(horizontal.x - offset.x, horizontal.y, ctx.canvas.width, 1);

    // X Positive
    DrawLineNumbers(-1000000, 0, (num) => num < ctx.canvas.width / 2 - offset.x, 1, ctx, 1, 5)
    
    // X Negative
    DrawLineNumbers(1000000, 0, (num) => num > -ctx.canvas.width / 2 - offset.x, -1, ctx, 1, 5)
}

function DrawLineNumbers(prev, numInit, condition, iterator, ctx, lineX, lineY) {
    for(let xNum = numInit; condition(xNum); xNum+=iterator) {
        var textCoords = ConvertCoordinates(xNum * scale, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillRect(textCoords.x, textCoords.y, lineX, lineY);

        if((xNum * scale) > prev + MAX_NUMBER_GAP || (xNum * scale) < prev - MAX_NUMBER_GAP) 
        {
            ctx.font = "18px Arial";
            ctx.textAlign = 'center';
            ctx.fillText((xNum).toString(), textCoords.x, textCoords.y+20);

            prev = xNum * scale;
        }
    }
}

function Draw() {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight - 110;

    DrawGraph();
  }

function DrawGraph()
{
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
    
    DrawLines();

    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;

    ctx.beginPath();

    for (let x = -ctx.canvas.width / 2 - offset.x; x < ctx.canvas.width / 2 - 1 - offset.x; x++) {

        var coords = ConvertCoordinates(x, evaluate(x / scale) * scale, ctx.canvas.width, ctx.canvas.height);
        var nextCoords = ConvertCoordinates(x+1, evaluate((x+1) / scale) * scale, ctx.canvas.width, ctx.canvas.height);
        
        ctx.moveTo(coords.x, coords.y);
        ctx.lineTo(nextCoords.x, nextCoords.y);
    }

    ctx.stroke();
}

function ConvertCoordinates(x, y, width, height) {
 return { x: x + (width / 2) + offset.x, y: -y + (height / 2) + offset.y}
}

function evaluate(xVal) {
    try {
        return func.evaluate({x: xVal});
    } catch {return null;}
}

function ParseInput() {
    var input = document.getElementById("funcInput").value;

    try {
    func = math.parse(input).compile()
    } catch { func = null; }

    DrawGraph();
}

function UpdateScale(newScale) {
    scaleDelta = newScale - scale;
    
    scale = clamp(newScale, 2, 200);

    DrawGraph();
}

window.addEventListener('resize', Draw, false);

function getCanvasRelative(e) {
    var canvas = e.target,
    bx = canvas.getBoundingClientRect();
    return {
        x: (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - bx.left,
        y: (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - bx.top
    };
};
function distance (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

let pointerDown = false;
function pointerDownEvent(e) {
        pointerDown = true;
}
function pointerMoveEvent(e) {
    if(pointerDown) {
        offset.x += e.movementX;
        offset.y += e.movementY;
        DrawGraph();
    }
}
function pointerUpEvent(e) {
    pointerDown = false;
};

canvas.addEventListener('mousedown', pointerDownEvent);
canvas.addEventListener('mousemove', pointerMoveEvent);
canvas.addEventListener('mouseup', pointerUpEvent);
canvas.addEventListener('touchstart', pointerDownEvent);
canvas.addEventListener('touchmove', pointerMoveEvent);
canvas.addEventListener('touchend', pointerUpEvent);

function reset() {
    offset.x = 0;
    offset.y = 0;
    UpdateScale(50);
    DrawGraph();
}

let zoomInputMultiplier = 15;

function zoomIn() {
    UpdateScale(scale + zoomInputMultiplier);
}

function zoomOut() {
    UpdateScale(scale - zoomInputMultiplier);
}

addEventListener('keydown', (event) => 
{ 
    if(event.key == "r") {
        reset();
    }
});

addEventListener('wheel', (event) => 
{
    UpdateScale(scale +=  (scale / -event.deltaY) * zoomInputMultiplier);
});

ParseInput();
reset();
Draw();