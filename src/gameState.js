import { some } from 'lodash/fp';
import { openGameOverModal } from './components/gameOverModal';

const ALL_TILES_COUNT = 36;

let tiles = [];
let uncoveredTiles = [];
let moves = 0;

export function uncoverTile(name) {
  if (uncoveredTiles.filter(title => title === name).length < 2) {
    uncoveredTiles.push(name);
  }
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

export function incrementMoves() {
  moves += 1;
}

export function getMoves() {
  return moves / 2;
}

export function resetMoves() {
  moves = 0;
  uncoveredTiles = [];
  tiles = [];
}
