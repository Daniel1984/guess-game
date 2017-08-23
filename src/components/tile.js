import { tween, spring, chain, delay } from 'popmotion';
import pubsub from 'pubsub-js';
import state from '../state';
import { some } from 'lodash/fp';

const Pixi = require('pixi.js');

const SET_STATE = 'tile:change';
const CLEAR_STATE = 'clear:state';

export default function tile({ texture, size, name, num }) {
  const tileContainer = new Pixi.Container();
  tileContainer.interactive = true;
  tileContainer.buttonMode = true;
  tileContainer.width = size;
  tileContainer.height = size;

  pubsub.subscribe(CLEAR_STATE, (msg, { firstSelection, secondSelection }) => {
    state.splice(state.indexOf(firstSelection), 1);
    state.splice(state.indexOf(secondSelection), 1);
  });

  pubsub.subscribe(SET_STATE, (msg, tile) => {
    if (!some(tile, state)) {
      state.push(tile);
    }

    if (state.length % 2 === 0) {
      tileContainer.interactive = false;
      tileContainer.buttonMode = false;

      const firstSelection = state[state.length - 2];
      const secondSelection = state[state.length - 1];
      const differentTilesOpened = firstSelection.name !== secondSelection.name;
      const fistTileMatch = firstSelection.name === name && firstSelection.num === num;
      const secondTileMatch = secondSelection.name === name && secondSelection.num === num;
      const firstOrSecondTileMatch = fistTileMatch || secondTileMatch;

      tileContainer.interactive = true;
      tileContainer.buttonMode = true;

      if (differentTilesOpened && firstOrSecondTileMatch) {
        pubsub.publish(CLEAR_STATE, { firstSelection, secondSelection });
        closeTile();
      } else if (!differentTilesOpened && firstOrSecondTileMatch) {
        tileContainer.interactive = false;
        tileContainer.buttonMode = false;
        tileContainer.off('pointerdown', handleTileSelection);
      }
    }
  });

  const textureSprite = new Pixi.Sprite(texture);
  textureSprite.x = size / 2;
  textureSprite.y = size / 2;
  textureSprite.width = size;
  textureSprite.height = size;
  textureSprite.anchor.x = 0.5;
  textureSprite.anchor.y = 0.5;

  const textureOverlay = new Pixi.Graphics();
  textureOverlay.beginFill(0xfcb856, 1);
  textureOverlay.drawRect(0, 0, size, size);

  tileContainer.addChild(textureSprite);
  tileContainer.addChild(textureOverlay);

  function handleTileSelection() {
    tileContainer.off('pointerdown', handleTileSelection);
    openTile();
    tileContainer.interactive = false;
    tileContainer.buttonMode = false;
    pubsub.publish(SET_STATE, { name, num });
  }

  tileContainer.on('pointerdown', handleTileSelection);

  function openTile() {
    tween({
      from: textureOverlay.height,
      to: 0,
      duration: 200,
      onUpdate(height) {
        textureOverlay.height = height;
      },
    }).start();
  }

  function closeTile() {
    chain([
      delay(800),
      spring({
        mass: 2,
        stiffness: 2000,
        damping: 30,
        to: size,
        onUpdate(height) {
          textureOverlay.height = height;
        },
        onComplete() {
          tileContainer.on('pointerdown', handleTileSelection);
        },
      }),
    ]).start();
  }

  return tileContainer;
}
