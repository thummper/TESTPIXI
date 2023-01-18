let app = new PIXI.Application({
    width: 1024,
    height: 600,
});
document.body.appendChild(app.view);





class Game {
    pApp;
    base;
    graphics;
    enemies = [];
    maxEnemies = 5;
    constructor(app){
        this.pApp = app;
        console.log(this.pApp.width);
        this.initBase(10000, [this.pApp.renderer.width / 2, this.pApp.renderer.height / 2]);
        this.graphics = new PIXI.Graphics();
        


        this.pApp.ticker.add(this.gameLoop.bind(this));
    }

    initBase(health, location){
        this.base = new Base(health, location);
    }

    gameLoop(delta){
        //console.log("D: ", delta);
        
        this.base.draw(this.graphics);

        for(let i = 0; i < this.enemies.length; i++){
            this.enemies[i].update(delta);
            this.enemies[i].draw(this.graphics);
        }

        this.pApp.stage.addChild(this.graphics);
        this.spawnEnemy();


    }

    spawnEnemy(){
        if(this.enemies.length <= this.maxEnemies){
            // Spawn enemy.
            let enemy = new Enemy(20, [0, (Math.random() * this.pApp.renderer.height)]);
            enemy.targetLocation = this.base.location; 
            this.enemies.push(enemy);
        }
    }
}




class Entity{
    color;
    location;
    health = 100;
    size; 
    constructor(health, location){
        this.health = health;
        this.location = location;
    }
    draw(graphics){
        //console.log("DRAW AT: ", this.location[0], this.location[1]);
        graphics.beginFill(this.color);
        graphics.drawRect(this.location[0] - (this.size / 2), this.location[1] - (this.size / 2), this.size, this.size);
        graphics.endFill();
    }    
}

class Base extends Entity{
    color = 0xFFAAAA;
    size = 40;
    constructor(health, location){
        super(health, location);
    }


}

class Enemy extends Entity{
    color = 0x990033;
    targetLocation;
    moveSpeed = 5;
    size = 5


    constructor(health, location){
        super(health, location);
    }

    update(delta){
        // Move towards target location
        let dx = this.targetLocation[0] - this.location[0];
        let dy = this.targetLocation[1] - this.location[1];
        

        this.location[0] += (dx / 1000) * (this.moveSpeed * delta);
        this.location[1] += (dy / 1000) * (this.moveSpeed * delta);

    }

}






let game = new Game(app);
