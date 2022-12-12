
let func = null;
let scale = 1;

function DrawLines() {
    var c = document.getElementById("graphic");
    var ctx = c.getContext("2d");

    ctx.fillRect(ctx.canvas.width / 2, 0, 1, ctx.canvas.height);
    ctx.fillRect(0, ctx.canvas.height / 2, ctx.canvas.width, 1);
}

function draw() {
    var c = document.getElementById("graphic");
    var ctx = c.getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight - 110;
    //...drawing code...

    DrawGraph();
  }

function DrawGraph()
{
    var c = document.getElementById("graphic");
    var ctx = c.getContext("2d");

    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
    
    DrawLines();

    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;

    ctx.beginPath();

    for (let x = -ctx.canvas.width / 2; x < ctx.canvas.width / 2 - 1; x++) {

        var coords = ConvertCoordinates(x, evaluate(x / scale) * scale, ctx.canvas.width, ctx.canvas.height);
        var nextCoords = ConvertCoordinates(x+1, evaluate((x+1) / scale) * scale, ctx.canvas.width, ctx.canvas.height);

        ctx.moveTo(coords.x, coords.y);
        ctx.lineTo(nextCoords.x, nextCoords.y);
    }

    ctx.stroke();

    var prevX = -100000000;
    for(let xNum = -ctx.canvas.width / 2; xNum < ctx.canvas.width / 2; xNum++) {
        if((xNum * scale) > prevX + 100) {
            var textCoords = ConvertCoordinates(xNum * scale, -18, ctx.canvas.width, ctx.canvas.height);

            console.log(textCoords);

            ctx.font = "18px serif";
            ctx.textAlign = 'center';
            ctx.fillText((xNum).toString(), textCoords.x, textCoords.y);

            prevX = xNum * scale;
        }
    }

    var prevY = -100000000;
    for(let yNum = -ctx.canvas.height / 2; yNum < ctx.canvas.height / 2; yNum++) {
        if((yNum * scale) > prevY + 100) {
            var textCoords = ConvertCoordinates(-5, yNum * scale, ctx.canvas.width, ctx.canvas.height);

            console.log(textCoords);

            ctx.font = "18px serif";
            ctx.textAlign = 'center';
            ctx.fillText((yNum).toString(), textCoords.x, textCoords.y);

            prevY = yNum * scale;
        }
    }
}

function ConvertCoordinates(x, y, width, height) {
 return { x: x + (width / 2), y: -y + (height / 2)}
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

function UpdateScale() {
    scale = document.getElementById("scale").value;

    DrawGraph();
}

window.addEventListener('resize', draw, false);

ParseInput();
UpdateScale();
draw();