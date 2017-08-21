import { tween, spring, chain, physics } from 'popmotion';

const Pixi = require('pixi.js');

export default function intro({ startGame, app }) {
  const tileContainer = new Pixi.Container();

  const title = new Pixi.Text('Hostmaker Guess', {
    fontSize: 50,
    fontFamily: 'Sigmar One',
    fill: 'rgb(87, 197, 198)',
    stroke: '#000',
    strokeThickness: 4,
  });

  title.anchor.set(0.5);
  title.scale.x = 0;
  title.scale.y = 0;
  title.x = app.renderer.width / 2;
  title.y = app.renderer.height / 2;

  tileContainer.addChild(title);

  const updateTitleAlpga = (alpha) => {
    title.alpha = alpha;
  };

  const updateScale = (scale) => {
    title.scale.x = scale;
    title.scale.y = scale;
  };

  const updateTitleY = (y) => {
    title.y = y;
  };

  tween({
    to: 1,
    duration: 500,
    onUpdate: updateTitleAlpga,
  }).start();

  chain([
    spring({
      mass: 2,
      stiffness: 2000,
      damping: 30,
      to: 1,
      onUpdate: updateScale,
    }),
    physics({
      from: title.y,
      to: 30,
      velocity: 300,
      spring: 300,
      friction: 0.8,
      onUpdate: updateTitleY,
    }),
  ]).start();

  return tileContainer;
}
