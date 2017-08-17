import { shuffle, flow } from 'lodash/fp';
import assetManager from './assetsManager';
import tile from './components/tile';
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

const app = new Pixi.Application(STAGE_WIDTH, STAGE_HEIGHT, { backgroundColor: 0xff7f00 });
document.querySelector('.hostmaker-guess').appendChild(app.view);

function getPairedTiles(inputNames = [], outputNames = []) {
  const tileIndex = Math.floor(Math.random() * inputNames.length);
  const textureName = inputNames.splice(tileIndex, 1);
  const texture = { name: textureName[0], revealed: false };

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
  const tileRows = flow(
    getPairedTiles,
    shuffle,
    splitTileListIntoRows
  )(Object.keys(resources));

  tileRows.forEach((row, i) => {
    row.forEach(({ name, revealed }, j) => {
      const tileWithTexture = tile({
        texture: resources[name].texture,
        size: TILE_SIZE,
        revealed,
        app,
      });

      tileWithTexture.x = ((j % GRID_WIDTH) * TILE_SIZE) + (TILE_GAP * j);
      tileWithTexture.y = ((i % GRID_HEIGHT) * TILE_SIZE) + (TILE_GAP * i);
      app.stage.addChild(tileWithTexture);
    });
  });
});
