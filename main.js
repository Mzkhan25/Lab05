var game = new Phaser.Game(600, 550, Phaser.AUTO, 'gameDiv');

var mainState = {

    preload: function() { 
        game.stage.backgroundColor = '#71c5cf';

        game.load.image('player', 'assets/crow.png');  
        game.load.image('object', 'assets/object.png'); 

       
        game.load.audio('jump', 'assets/jump.wav');     
    },

    create: function() { 
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.objects = game.add.group();
        this.objects.enableBody = true;
        this.objects.createMultiple(20, 'object');  
        this.timer = this.game.time.events.loop(1500, this.addRowOfobjects, this);

   
        this.player = this.game.add.sprite(100, 245, 'player');
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 1000; 

     
        this.player.anchor.setTo(-0.2, 0.5); 
 
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 

        this.score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });  

       
        this.jumpSound = this.game.add.audio('jump');
    },

    update: function() {
        if (this.player.inWorld == false) {
            alert("Game over");
            this.restartGame();
        }
             

        game.physics.arcade.overlap(this.player, this.objects, this.hitobject, null, this); 

   
        if (this.player.angle < 20)
            this.player.angle += 1;     
    },

    jump: function() {
        if (this.player.alive == false)
            return; 

        this.player.body.velocity.y = -350;

        game.add.tween(this.player).to({angle: -20}, 100).start();

        this.jumpSound.play();
    },

    hitobject: function() {
        if (this.player.alive == false)
            return;
            
        this.player.alive = false;

        this.game.time.events.remove(this.timer);
    
        this.objects.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    restartGame: function() {
        game.state.start('main');
    },

    addOneobject: function(x, y) {
        var object = this.objects.getFirstDead();

        object.reset(x, y);
        object.body.velocity.x = -200;  
        object.checkWorldBounds = true;
        object.outOfBoundsKill = true;
    },

    addRowOfobjects: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOneobject(400, i*60+10);   
    
        this.score += 1;
        this.labelScore.text = this.score;  
    },
};

game.state.add('main', mainState);  
game.state.start('main'); 