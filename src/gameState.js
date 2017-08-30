import { some } from 'lodash/fp';
import { saveScore } from './firebase';

const ALL_TILES_COUNT = 36;

const tiles = [];
const uncoveredTiles = [];
let score = 0;

export function uncoverTile(name) {
  uncoveredTiles.push(name);
}

export function checkIfGameComplete() {
  if (uncoveredTiles.length === ALL_TILES_COUNT) {
    const name = window.prompt('Please enter your nickname'); // eslint-disable-line
    saveScore({ name, score }).then((res) => {
      resetScore();
      console.log('score was saved ', res);
    });
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

function resetScore() {
  score = 0;
}
