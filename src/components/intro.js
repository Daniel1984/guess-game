import { tween, spring, chain, physics } from 'popmotion';

const Pixi = require('pixi.js');

export default function intro({ startGame, app }) {
  const stageWidth = app.renderer.width;
  const stageHeight = app.renderer.height;
  const stageCenterX = stageWidth / 2;
  const stageCenterY = stageHeight / 2;

  const tileContainer = new Pixi.Container();
  tileContainer.pivot.x = stageCenterX;
  tileContainer.pivot.y = stageCenterY;
  tileContainer.x = stageCenterX;
  tileContainer.y = stageCenterY;

  const commonFonstStyles = {
    fontFamily: 'Sigmar One',
    fill: 'rgb(87, 197, 198)',
    stroke: '#000',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 4,
  };

  const title = new Pixi.Text('Hostmaker Guess', { ...commonFonstStyles, fontSize: 50 });

  title.anchor.set(0.5);
  title.scale.x = 0;
  title.scale.y = 0;
  title.x = stageCenterX;
  title.y = stageCenterY;

  const ruleOne = new Pixi.Text(
    'Complete the game as fast as you can!',
    { ...commonFonstStyles, fontSize: 26 }
  );
  ruleOne.anchor.set(0.5);
  ruleOne.x = -stageWidth - (ruleOne.width / 2);
  ruleOne.y = stageCenterY - 35;

  const ruleTwo = new Pixi.Text('Good luck!', { ...commonFonstStyles, fontSize: 35 });
  ruleTwo.anchor.set(0.5);
  ruleTwo.x = stageWidth + (ruleTwo.width / 2);
  ruleTwo.y = stageCenterY;

  const buttonContainer = new Pixi.Container();
  buttonContainer.width = 250;
  buttonContainer.height = 60;
  buttonContainer.x = stageCenterX - 125;
  buttonContainer.y = stageHeight + 50;
  buttonContainer.buttonMode = true;
  buttonContainer.interactive = true;

  const startGameText = new Pixi.Text('START', { ...commonFonstStyles, fontSize: 35 });
  ruleTwo.anchor.set(0.5);
  startGameText.x = 50;

  const startButtonBg = new Pixi.Graphics();
  startButtonBg.beginFill(0xff4500);
  startButtonBg.drawRoundedRect(25, 0, 200, 60, 10);
  startButtonBg.endFill();
  startButtonBg.buttonMode = true;
  startButtonBg.interactive = true;

  buttonContainer.addChild(startButtonBg);
  buttonContainer.addChild(startGameText);
  tileContainer.addChild(title);
  tileContainer.addChild(ruleOne);
  tileContainer.addChild(ruleTwo);
  tileContainer.addChild(buttonContainer);

  buttonContainer.on('pointerdown', fadeOutIntroAndStartGame);

  function fadeOutIntroAndStartGame() {
    tween({
      from: 0,
      to: 30,
      duration: 1200,
      onUpdate(rotation) {
        tileContainer.rotation = rotation;
      },
    }).start();

    tween({
      from: 1,
      to: 0,
      duration: 1200,
      onComplete() {
        startGame();
      },
      onUpdate(scale) {
        tileContainer.scale.set(scale);
      },
    }).start();
  }

  tween({
    to: 1,
    duration: 500,
    onUpdate(alpha) {
      title.alpha = alpha;
    },
  }).start();

  chain([
    spring({
      mass: 2,
      stiffness: 2000,
      damping: 30,
      to: 1,
      onUpdate(scale) {
        title.scale.x = scale;
        title.scale.y = scale;
      },
    }),
    physics({
      from: title.y,
      to: 50,
      velocity: 300,
      spring: 300,
      friction: 0.8,
      autoStopSpeed: 0.2,
      onUpdate(y) {
        title.y = y;
      },
    }),
    physics({
      from: ruleOne.x,
      to: stageCenterX,
      velocity: 300,
      spring: 300,
      friction: 0.8,
      autoStopSpeed: 1,
      onUpdate(x) {
        ruleOne.x = x;
      },
    }),
    physics({
      from: ruleTwo.x,
      to: stageCenterX,
      velocity: 300,
      spring: 300,
      friction: 0.8,
      autoStopSpeed: 1,
      onUpdate(x) {
        ruleTwo.x = x;
      },
    }),
    physics({
      from: buttonContainer.y,
      to: stageHeight - 100,
      velocity: 300,
      spring: 300,
      friction: 0.8,
      autoStopSpeed: 0.5,
      onUpdate(y) {
        buttonContainer.y = y;
      },
    }),
  ]).start();

  return tileContainer;
}
