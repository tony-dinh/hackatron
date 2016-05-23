Hackatron = {
    skipIntro: true
};

Hackatron.Boot = function(game) {
    this.game = game;
};

Hackatron.Boot.prototype = {
    preload: function() {
        // console.log("inside boot state");
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale(window.innerWidth / Hackatron.GAME_WIDTH, window.innerWidth / Hackatron.GAME_WIDTH);

        // enable crisp rendering
        this.game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

        var assetsPath = 'App/Assets/';
        this.load.image('gfx/overlays/preloader',  assetsPath + 'GFX/overlays/preloader.gif');
    },

    create: function() {
        this.game.state.start('Preload');
    }
};
