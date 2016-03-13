var ShatterArray = function ShatterArray(game, key, frames) {
    var arrayOfShatteredGroups = [];

    frames.forEach(function(frame) {
        game.shattered[frame] = ShatterSprite(game, key, frame);
        arrayOfShatteredGroups.push(game.shattered[frame]);
    });

    return arrayOfShatteredGroups;
}

//ShatterArray(this.game, 'tron', ['icetile01', 'icetile02', 'icetile03']);
var ShatterSprite = function ShatterSprite(game, key, frame) {
    var numberOfSprites = 12;
    var offCanvas = -1000;

    function getImageFromSprite(game, key, frame) {
        var sprite = game.add.sprite(offCanvas, offCanvas, key, frame);
        var bmd = game.add.bitmapData(sprite.width, sprite.height);
        var image = new Image();

        bmd.draw(sprite, 0, 0, sprite.width, sprite.height);
        bmd.update();
        sprite.destroy();
        image.src = bmd.canvas.toDataURL();
        return image;
    }

    function createShatteredGroup(game, shatteredImage) {
        var shatteredGroup = game.add.group();

        shatteredImage.images.forEach(function(image, ind, arr) {
            var key = frame + ind;
            game.cache.addImage(key, null, image.image);
            var sprite = shatteredGroup.create(offCanvas, offCanvas, key);
            sprite.originX = image.x;
            sprite.originY = image.y;
            game.physics.arcade.enable(sprite);
            sprite.body.checkCollision.left = false;
            sprite.body.checkCollision.right = false;
            sprite.body.checkCollision.up = false;
        });
        return shatteredGroup;
    }

    return createShatteredGroup(game, 
        new Shatter(getImageFromSprite(game, key, frame), numberOfSprites));
}


// usage:
// var xVelocityMin = -50;
// var xVelocityMax = 50;
// var yVelocityMin = -1000;
// var yVelocityMax = -500;
// var exploder = new ShatterSprite(self.game, 'tron', new Phaser.Rectangle(0,0,32,32));
// exploder.x = self.player.sprite.worldX;
// exploder.y = self.player.sprite.worldY;
// exploder.children.forEach(function(sprite) {
//     sprite.x = sprite.originX;
//     sprite.y = sprite.originY;
//     sprite.body.velocity.x = self.game.rnd.integerInRange(xVelocityMin, xVelocityMax);
//     sprite.body.velocity.y = self.game.rnd.integerInRange(yVelocityMin, yVelocityMax);
// });