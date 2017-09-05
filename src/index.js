import { physics, spring } from 'popmotion';
import { shuffle, flow } from 'lodash/fp';
import pubsub from 'pubsub-js';
import tile from './components/tile';
import intro from './components/intro';
import retryGame from './components/retryGame';
import { initDb } from './firebase';
import { initGameOverModal } from './components/gameOverModal';
import { initTopScoreModal } from './components/topScoreModal';
import spritesheetOneJson from './assets/spritesheetOne.json';
import spritesheetOnePng from './assets/spritesheetOne.png';
import './index.scss';

const Pixi = require('pixi.js');

const GRID_WIDTH = 6;
const GRID_HEIGHT = 6;
const MAX_TILE_COUNT = GRID_WIDTH * GRID_HEIGHT;
const TILE_SIZE = 100;
const TILE_GAP = 5;
const TOTAL_GAPS_WIDTH = TILE_GAP * (GRID_WIDTH - 1);
const TOTAL_GAPS_HEIGHT = TILE_GAP * (GRID_HEIGHT - 1);
const STAGE_WIDTH = (GRID_WIDTH * TILE_SIZE) + TOTAL_GAPS_WIDTH;
const STAGE_HEIGHT = (GRID_HEIGHT * TILE_SIZE) + TOTAL_GAPS_HEIGHT;

window.WebFontConfig = {
  google: {
    families: ['Sigmar One'],
  },
  active() {
    initGame();
  },
};

(() => {
  const wf = document.createElement('script');
  const protocol = document.location.protocol === 'https:' ? 'https' : 'http';
  wf.src = `${protocol}://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
  wf.type = 'text/javascript';
  wf.async = 'true';
  document.body.appendChild(wf);
})();

function initGame() {
  pubsub.subscribe('gameOverModal:restart', startGame);
  pubsub.subscribe('gameOverModal:show:retry:scene', showRetryGameScene);

  initDb();

  initGameOverModal({ modalClassName: 'modal-gameover' });
  initTopScoreModal({ modalClassName: 'modal-topscore' });

  const app = new Pixi.Application(STAGE_WIDTH, STAGE_HEIGHT, { backgroundColor: 0xff7f00 });
  document.querySelector('.hostmaker-guess').appendChild(app.view);

  function getPairedTiles(inputNames = [], outputNames = []) {
    const tileIndex = Math.floor(Math.random() * inputNames.length);
    const textureName = inputNames.splice(tileIndex, 1);
    const texture = { name: textureName[0] };

    outputNames = [...outputNames, { ...texture, num: 1 }, { ...texture, num: 2 }];

    if (outputNames.length < MAX_TILE_COUNT) {
      return getPairedTiles(inputNames, outputNames);
    }

    return outputNames;
  }

  function splitTileListIntoRows(tiles, rowsWithTiles = []) {
    rowsWithTiles.push(tiles.splice(0, 6));
    return tiles.length ? splitTileListIntoRows(tiles, rowsWithTiles) : rowsWithTiles;
  }

  function showRetryGameScene() {
    app.stage.removeChildren();
    app.stage.addChild(retryGame({ app, startGame }));
  }

  Pixi.loader
    .add('spritesheetOne', spritesheetOnePng)
    .load((loader, resources) => {
      const sheet = new Pixi.Spritesheet(resources.spritesheetOne.texture.baseTexture, spritesheetOneJson);
      sheet.parse(initStage);
    });

  function initStage() {
    spring({
      mass: 2,
      stiffness: 1000,
      damping: 30,
      to: 1,
      onUpdate(scale) {
        app.view.style.transform = `scale(${scale})`;
      },
      onComplete() {
        app.stage.addChild(intro({ app, startGame }));
      },
    }).start();
  }

  function startGame() {
    app.stage.removeChildren();

    const tileRows = flow(
      getPairedTiles,
      shuffle,
      splitTileListIntoRows
    )(Object.keys(spritesheetOneJson.frames));

    tileRows.forEach((row, i) => {
      row.forEach(({ name, num }, j) => {
        const tileWithTexture = tile({
          texture: Pixi.Sprite.fromFrame(name),
          size: TILE_SIZE,
          num,
          name,
          app,
        });

        const getPosition = count => ((count % GRID_WIDTH) * TILE_SIZE) + (TILE_GAP * count);

        tileWithTexture.x = getPosition(j);
        tileWithTexture.y = getPosition(i);
        tileWithTexture.height = 0;

        app.stage.addChild(tileWithTexture);

        physics({
          from: 0,
          to: TILE_SIZE,
          velocity: 200,
          spring: 400,
          friction: 0.8,
          autoStopSpeed: 1,
          onUpdate(height) {
            tileWithTexture.height = height;
          },
        }).start();
      });
    });
  }
}
