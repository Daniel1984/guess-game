import { some } from 'lodash/fp';

const ALL_TILES_COUNT = 36;

const tiles = [];
const uncoveredTiles = [];

export function uncoverTile(name) {
  uncoveredTiles.push(name);
}

export function checkIfGameComplete() {
  if (uncoveredTiles.length === ALL_TILES_COUNT) {
    alert('game over');
  }
}

export function addTile(tile) {
  tiles.push(tile);
}

export function removeTile(tile) {
  tiles.splice(tiles.indexOf(tile), 1);
}

export function tileAlreadyAdded(tile) {
  return some(tile, tiles);
}

export function getAllTiles() {
  return tiles;
}
