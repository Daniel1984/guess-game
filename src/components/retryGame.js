import { tween } from 'popmotion';
import { openTopScoreModal } from './topScoreModal';

const Pixi = require('pixi.js');

export default function retryGame({ startGame, app }) {
  const stageWidth = app.renderer.width;
  const stageHeight = app.renderer.height;
  const stageCenterX = stageWidth / 2;
  const stageCenterY = stageHeight / 2;

  const container = new Pixi.Container();
  container.pivot.x = stageCenterX;
  container.pivot.y = stageCenterY;
  container.x = stageCenterX;
  container.y = stageCenterY;

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

  const restartButtonContainer = new Pixi.Container();
  restartButtonContainer.width = 350;
  restartButtonContainer.height = 60;
  restartButtonContainer.x = stageCenterX - 160;
  restartButtonContainer.y = stageCenterY + 50;
  restartButtonContainer.buttonMode = true;
  restartButtonContainer.interactive = true;

  const restartGameText = new Pixi.Text('Retry', { ...commonFonstStyles, fontSize: 35, fill: 0xff4500 });
  restartGameText.x = 100;

  const restartButtonBg = new Pixi.Graphics();
  restartButtonBg.beginFill(0x57c5c6);
  restartButtonBg.drawRoundedRect(25, 0, 280, 60, 10);
  restartButtonBg.endFill();
  restartButtonBg.buttonMode = true;
  restartButtonBg.interactive = true;

  const topScoreBtnContainer = new Pixi.Container();
  topScoreBtnContainer.width = 350;
  topScoreBtnContainer.height = 60;
  topScoreBtnContainer.x = stageCenterX - 160;
  topScoreBtnContainer.y = stageCenterY - 50;
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

  restartButtonContainer.addChild(restartButtonBg);
  restartButtonContainer.addChild(restartGameText);
  topScoreBtnContainer.addChild(topScoreButtonBg);
  topScoreBtnContainer.addChild(topScoreText);
  container.addChild(restartButtonContainer);
  container.addChild(topScoreBtnContainer);

  restartButtonContainer.on('pointerdown', fadeOutIntroAndStartGame);
  topScoreBtnContainer.on('pointerdown', openTopScoreModal);

  function fadeOutIntroAndStartGame() {
    tween({
      from: 0,
      to: 30,
      duration: 1200,
      onUpdate(rotation) {
        container.rotation = rotation;
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
        container.scale.set(scale);
      },
    }).start();
  }

  return container;
}
