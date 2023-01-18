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
    maxEnemies = 10;
    idHandler;
    constructor(app){
        this.pApp = app;
        console.log(this.pApp.width);
        this.initBase(10000, [this.pApp.renderer.width / 2, this.pApp.renderer.height / 2]);
        this.graphics = new PIXI.Graphics();
        this.idHandler = new IDHandler();
        


        this.pApp.ticker.add(this.gameLoop.bind(this));
        this.pApp.stage.addChild(this.graphics);
    }

    initBase(health, location){
        this.base = new Base(health, location);
    }

    gameLoop(delta){
        //console.log("D: ", delta);
        this.graphics.clear();
        this.base.draw(this.graphics);
        this.spawnEnemy();


        this.enemyLogic(delta);
        this.cleanEnemies();

        
        


    }

    cleanEnemies(){
        let newEnemies = [];
        for(let e of this.enemies){
            if(!e.dead){
                newEnemies.push(e);
            }
        }
        this.enemies = newEnemies;
    }

    enemyLogic(delta){
        // Update pos
        for(let i = 0; i < this.enemies.length; i++){
            this.enemies[i].update(delta);
            
        }
        // Check for merging
        for(let i = 0; i < this.enemies.length; i++){
            this.enemies[i].checkMerge(this.enemies, i);
        }

        // Draw
        for(let i = 0; i < this.enemies.length; i++){
            this.enemies[i].draw(this.graphics);
        }

    }

    spawnEnemy(){
        if(this.enemies.length < this.maxEnemies){
            // Spawn enemy.
            let enemy = new Enemy(this.idHandler.getID(), 20, [0, (Math.random() * this.pApp.renderer.height)]);
            enemy.targetLocation = this.base.location; 
            this.enemies.push(enemy);
        }
    }
}


class IDHandler{
    nextID = 0;
    constructor(){}

    getID(){
        this.nextID += 1;
        return this.nextID;
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
    size = 10
    dead = false;
    mergeCD = 0;
    id;



    constructor(id, health, location){
        
        super(health, location);
        this.id = id;
    }

    update(delta){
        // Move towards target location
        let dx = this.targetLocation[0] - this.location[0];
        let dy = this.targetLocation[1] - this.location[1];

        // Need to move in direction of unit vector * speed I think
        

        this.location[0] += dx * (this.moveSpeed * (delta / 5000));
        this.location[1] += dy * (this.moveSpeed * (delta / 5000));

        this.mergeCD -= delta;
        if(this.mergeCD < 0){
            this.mergeCD = 0;
        }

        //console.log(this.size);

    }

    checkMerge(enemies, current){
        // Loop through all other enemies, if we are within a threshold, merge together! 


        for(let i = 0; i < enemies.length; i++){
            let e = enemies[i];

            if(!this.dead && i != current && !e.dead && this.mergeCD == 0){

                let dist = Math.hypot(e.location[0] - this.location[0], e.location[1] - this.location[1]);
                if(dist < 25){
                    this.mergeWith(e);
                }

            }


        }


        // for(let i = 0; i < enemies.length; i++){
        //     let e = enemies[i];

        //     if(e.dead){
        //         console.log("skipping: ", e.id);
        //         continue;
        //     } else {
        //         console.log(e.id, " is not dead");
        //     }
           
        //     if(i != current && !e.dead && this.mergeCD == 0){
                

        //         let dist = Math.hypot(e.location[0] - this.location[0], e.location[1] - this.location[1]);
        //         //console.log("DIST, ", dist);

        //         if(dist < 25){
        //             // Merge this enemy with the other one

        //             this.mergeWith(e);


        //         }
        //     }
        // }

        


    }

    mergeWith(enemy){
        console.log("Merging: ", this.id, " with: ", enemy.id);
        this.health += enemy.health;
        this.size += enemy.size;
        this.mergeCD = 300;
        

        console.log("Killing merge target: ", enemy.id);
        enemy.dead = true;
    }

    

}






let game = new Game(app);
