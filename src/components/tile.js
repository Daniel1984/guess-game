import pubsub from 'pubsub-js';
import state from '../state';
import { some } from 'lodash/fp';

const Pixi = require('pixi.js');

const SET_STATE = 'tile:change';
const CLEAR_STATE = 'clear:state';

export default function tile({ texture, size, app, name, num }) {
  let animate = false;
  let disabled = false;

  const tileContainer = new Pixi.Container();

  pubsub.subscribe(CLEAR_STATE, (msg, { firstSelection, secondSelection }) => {
    state.splice(state.indexOf(firstSelection), 1);
    state.splice(state.indexOf(secondSelection), 1);
  });

  pubsub.subscribe(SET_STATE, (msg, tile) => {
    if (disabled) {
      return;
    }

    if (!some(tile, state)) {
      state.push(tile);
    }

    let timeoutRef;

    if (state.length % 2 === 0) {
      clearTimeout(timeoutRef);

      tileContainer.interactive = false;
      tileContainer.buttonMode = false;

      const firstSelection = state[state.length - 2];
      const secondSelection = state[state.length - 1];
      const differentTilesOpened = firstSelection.name !== secondSelection.name;
      const fistTileMatch = firstSelection.name === name && firstSelection.num === num;
      const secondTileMatch = secondSelection.name === name && secondSelection.num === num;
      const firstOrSecondTileMatch = fistTileMatch || secondTileMatch;

      timeoutRef = setTimeout(() => {
        tileContainer.interactive = true;
        tileContainer.buttonMode = true;

        if (differentTilesOpened && firstOrSecondTileMatch) {
          pubsub.publish(CLEAR_STATE, { firstSelection, secondSelection });
          animate = false;
        } else if (!differentTilesOpened && firstOrSecondTileMatch) {
          disabled = true;
          tileContainer.interactive = false;
          tileContainer.buttonMode = false;
          tileContainer.off('pointerdown', animateTile);
        }
      }, 1000);
    }
  });

  tileContainer.interactive = true;
  tileContainer.buttonMode = true;
  tileContainer.width = size;
  tileContainer.height = size;

  const textureSprite = new Pixi.Sprite(texture);
  textureSprite.x = size / 2;
  textureSprite.y = size / 2;
  textureSprite.width = size;
  textureSprite.height = size;
  textureSprite.anchor.x = 0.5;
  textureSprite.anchor.y = 0.5;

  const textureOverlay = new Pixi.Graphics();
  textureOverlay.beginFill(0x57C5C6, 1);
  textureOverlay.drawRect(0, 0, size, size);

  tileContainer.addChild(textureSprite);
  tileContainer.addChild(textureOverlay);

  function animateTile() {
    animate = true;
    tileContainer.interactive = false;
    tileContainer.buttonMode = false;
    pubsub.publish(SET_STATE, { name, num });
  }

  tileContainer.on('pointerdown', animateTile);

  app.ticker.add(() => {
    if (animate && textureOverlay.height > 0) {
      const newSize = textureOverlay.height - 10;
      textureOverlay.height = newSize;
    }

    if (!animate && textureOverlay.height < size) {
      const newSize = textureOverlay.height + 20;
      textureOverlay.height = newSize;
    }
  });

  return tileContainer;
}
