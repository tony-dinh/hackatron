Hackatron.Preload = function(game) {
    this.game = game;
    this.ready = false;
};

Hackatron.Preload.prototype = {
    preload: function() {
        this.preloaderBar = this.add.sprite(this.width/2,this.height/2, 'gfx/overlays/preloader');
        this.preloaderBar.x = Hackatron.GAME_WIDTH/4;
        this.preloaderBar.y = Hackatron.GAME_HEIGHT/2;
        this.preloaderBar.width = Hackatron.GAME_WIDTH/2;
        this.preloaderBar.anchor.setTo(0, 0);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.preloaderBar);

        var text = this.game.add.text(Hackatron.GAME_WIDTH/4, Hackatron.GAME_HEIGHT/2-50, "Loading...", {fill: '#ffffff' });
        this.game.load.onFileComplete.add((progress, cacheKey, success, totalLoaded, totalFiles) => {
            // console.log(progress);
            text.setText("Loading... " + progress + "%");
        }, this);

        this.game.add.plugin(Phaser.Plugin.Tiled);

        var assetsPath = 'App/Assets/'; //window.location.hostname === 'localhost' ? 'http://localhost:8080/assets/' : 'https://raw.githubusercontent.com/tony-dinh/hackatron/master/assets/';

        // Screens
        this.load.image('ui/screens/launch', assetsPath + 'UI/Screens/launch.png');

        // Effects
        this.load.image('gfx/effects/pellet', assetsPath + 'GFX/Effects/pellet.png');

        // Emitters
        this.load.image('gfx/emitters/blueball', assetsPath + 'GFX/emitters/blueball.png');
        this.load.image('gfx/emitters/brownie', assetsPath + 'GFX/emitters/brownie.png');

        // UI
        this.load.spritesheet('gfx/overlays/countdown', assetsPath + 'GFX/overlays/countdown.png', 29, 27, 3);
        this.load.image('gfx/overlays/gameover', assetsPath + 'GFX/overlays/gameover.png');

        // Buffs
        this.load.atlasJSONHash('gfx/buffs', assetsPath + 'GFX/buffs.png', assetsPath + 'GFX/buffs.json');

        // Blocks
        this.load.spritesheet('gfx/blocks/glitch', assetsPath + 'GFX/blocks/glitch.png', 32, 32, 3);

        // Map
        this.load.pack('map', assetsPath + 'GFX/maps/general.json');

        // Characters
        this.load.atlasJSONHash('gfx/characters', assetsPath + 'GFX/characters.png', assetsPath + 'GFX/characters.json');

        // Audio
        this.load.audio('audio/bg-0002', [assetsPath + 'Audio/bg-0002.mp3']);
    },

    update: function() {
        if(!!this.ready) {
            this.game.state.start('Menu');
        }
    },

    onLoadComplete: function() {
        this.ready = true;
    }
};
