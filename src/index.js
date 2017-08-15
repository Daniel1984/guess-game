import assetManager from './assetsManager';
import tile from './components/tile';
import './index.scss';

const PIXI = require('pixi.js');

const app = new PIXI.Application(600, 600, { backgroundColor: 0xffffff });
document.querySelector('.hostmaker-guess').appendChild(app.view);

assetManager(PIXI.loader).load((loader, resources) => {
  for (let i = 0; i < 36; i += 1) {
    const tileWithTexture = tile({ texture: resources.disco.texture, size: 100, app });
    tileWithTexture.x = (i % 6) * 100;
    tileWithTexture.y = Math.floor(i / 6) * 100;
    app.stage.addChild(tileWithTexture);
  }
});
