import { tween, spring, chain, physics } from 'popmotion';
import { openTopScoreModal } from './topScoreModal';

const Pixi = require('pixi.js');

export default function intro({ startGame, app }) {
  const stageWidth = app.renderer.width;
  const stageHeight = app.renderer.height;
  const stageCenterX = stageWidth / 2;
  const stageCenterY = stageHeight / 2;

  const introContainer = new Pixi.Container();
  introContainer.pivot.x = stageCenterX;
  introContainer.pivot.y = stageCenterY;
  introContainer.x = stageCenterX;
  introContainer.y = stageCenterY;

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
    'Complete the game with as few moves as possible!',
    {
      ...commonFonstStyles,
      fontSize: 26,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: stageWidth - 40,
    }
  );
  ruleOne.anchor.set(0.5);
  ruleOne.x = -stageWidth - (ruleOne.width / 2);
  ruleOne.y = stageCenterY - 70;

  const ruleTwo = new Pixi.Text('Good luck!', { ...commonFonstStyles, fontSize: 35 });
  ruleTwo.anchor.set(0.5);
  ruleTwo.x = stageWidth + (ruleTwo.width / 2);
  ruleTwo.y = stageCenterY;

  const startButtonContainer = new Pixi.Container();
  startButtonContainer.width = 350;
  startButtonContainer.height = 60;
  startButtonContainer.x = stageCenterX - 160;
  startButtonContainer.y = stageHeight + 50;
  startButtonContainer.buttonMode = true;
  startButtonContainer.interactive = true;

  const startGameText = new Pixi.Text('START', { ...commonFonstStyles, fontSize: 35, fill: 0xff4500 });
  startGameText.x = 100;

  const startButtonBg = new Pixi.Graphics();
  startButtonBg.beginFill(0x57c5c6);
  startButtonBg.drawRoundedRect(25, 0, 280, 60, 10);
  startButtonBg.endFill();
  startButtonBg.buttonMode = true;
  startButtonBg.interactive = true;

  const topScoreBtnContainer = new Pixi.Container();
  topScoreBtnContainer.width = 350;
  topScoreBtnContainer.height = 60;
  topScoreBtnContainer.x = stageCenterX - 160;
  topScoreBtnContainer.y = stageHeight + 50;
  topScoreBtnContainer.buttonMode = true;
  topScoreBtnContainer.interactive = true;

  const topScoreText = new Pixi.Text('TOP SCORE', { ...commonFonstStyles, fontSize: 35 });
  topScoreText.x = 50;

  const topScoreButtonBg = new Pixi.Graphics();
  topScoreButtonBg.beginFill(0xff4500);
  topScoreButtonBg.drawRoundedRect(25, 0, 280, 60, 10);
  topScoreButtonBg.endFill();
  topScoreButtonBg.buttonMode = true;
  topScoreButtonBg.interactive = true;

  startButtonContainer.addChild(startButtonBg);
  startButtonContainer.addChild(startGameText);
  topScoreBtnContainer.addChild(topScoreButtonBg);
  topScoreBtnContainer.addChild(topScoreText);
  introContainer.addChild(title);
  introContainer.addChild(ruleOne);
  introContainer.addChild(ruleTwo);
  introContainer.addChild(startButtonContainer);
  introContainer.addChild(topScoreBtnContainer);

  startButtonContainer.on('pointerdown', fadeOutIntroAndStartGame);
  topScoreBtnContainer.on('pointerdown', openTopScoreModal);

  function fadeOutIntroAndStartGame() {
    tween({
      from: 0,
      to: 30,
      duration: 1000,
      onUpdate(rotation) {
        introContainer.rotation = rotation;
      },
    }).start();

    tween({
      from: 1,
      to: 0,
      duration: 1000,
      onComplete() {
        startGame();
      },
      onUpdate(scale) {
        introContainer.scale.set(scale);
      },
    }).start();
  }

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
      autoStopSpeed: 0.5,
      onUpdate(y) {
        title.y = y;
      },
      onComplete: animateMsgAndCta,
    }),
  ]).start();

  function animateMsgAndCta() {
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
    }).start();

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
    }).start();

    physics({
      from: topScoreBtnContainer.y,
      to: stageHeight - 200,
      velocity: 300,
      spring: 300,
      friction: 0.8,
      autoStopSpeed: 1,
      onUpdate(y) {
        topScoreBtnContainer.y = y;
      },
    }).start();

    physics({
      from: startButtonContainer.y,
      to: stageHeight - 100,
      velocity: 300,
      spring: 300,
      friction: 0.8,
      autoStopSpeed: 1,
      onUpdate(y) {
        startButtonContainer.y = y;
      },
    }).start();
  }

  return introContainer;
}
