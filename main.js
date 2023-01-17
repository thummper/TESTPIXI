let app = new PIXI.Application({
    width: 1024,
    height: 600,
});
document.body.appendChild(app.view);

var graphics = new PIXI.Graphics();
graphics.beginFill(0xFFAAAA);

graphics.drawRect(0, 0, 300, 200);
graphics.endFill();

app.stage.addChild(graphics);

let elapsed = 0.0;
app.ticker.add((delta) => {
    elapsed += delta;
    
    //console.log("FT: ", delta);
});