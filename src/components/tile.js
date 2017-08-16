const PIXI = require('pixi.js');

export default function tile({ texture, size, app }) {
  let animate = false;
  const tileContainer = new PIXI.Container();

  tileContainer.interactive = true;
  tileContainer.buttonMode = true;
  tileContainer.width = size;
  tileContainer.height = size;

  const textureSprite = new PIXI.Sprite(texture);
  textureSprite.x = size / 2;
  textureSprite.y = size / 2;
  textureSprite.width = size;
  textureSprite.height = size;
  textureSprite.anchor.x = 0.5;
  textureSprite.anchor.y = 0.5;

  const textureOverlay = new PIXI.Graphics();
  textureOverlay.beginFill(0x57C5C6, 1);
  textureOverlay.drawRect(0, 0, size, size);

  tileContainer.addChild(textureSprite);
  tileContainer.addChild(textureOverlay);

  tileContainer.on('pointerdown', () => {
    animate = true;
  });

  app.ticker.add(() => {
    if (animate && textureOverlay.height > 0) {
      const newSize = textureOverlay.height - 10;
      textureOverlay.height = newSize;
    }
  });

  return tileContainer;
}
