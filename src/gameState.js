import { some } from 'lodash/fp';
import { openGameOverModal } from './components/gameOverModal';

const ALL_TILES_COUNT = 36;

const tiles = [];
const uncoveredTiles = [];
let score = 0;

export function uncoverTile(name) {
  uncoveredTiles.push(name);
}

export function checkIfGameComplete() {
  if (uncoveredTiles.length === ALL_TILES_COUNT) {
    openGameOverModal();
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

export function incrementScore() {
  score += 1;
}

export function getScore() {
  return score;
}

export function resetScore() {
  score = 0;
}
