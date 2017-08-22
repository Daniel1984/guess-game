import { shuffle, flow } from 'lodash/fp';
import assetManager from './assetsManager';
import tile from './components/tile';
import intro from './components/intro';
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

  assetManager(Pixi.loader).load((loader, resources) => {
    function startGame() {
      const tileRows = flow(
        getPairedTiles,
        shuffle,
        splitTileListIntoRows
      )(Object.keys(resources));

      tileRows.forEach((row, i) => {
        row.forEach(({ name, num }, j) => {
          const tileWithTexture = tile({
            texture: resources[name].texture,
            size: TILE_SIZE,
            num,
            name,
            app,
          });

          const getPosition = count => ((count % GRID_WIDTH) * TILE_SIZE) + (TILE_GAP * count);

          tileWithTexture.x = getPosition(j);
          tileWithTexture.y = getPosition(i);
          app.stage.addChild(tileWithTexture);
        });
      });
    }

    const introComponents = intro({ app, startGame });

    app.stage.addChild(introComponents);
  });
}
