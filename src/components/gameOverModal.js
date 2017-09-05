import pubsub from 'pubsub-js';
import { css, spring } from 'popmotion';
import { saveScore } from '../firebase';
import { getMoves, resetMoves } from '../gameState';

let modalEl;
let modalBackdropEl;
let modalScoreEl;
let tweenedModalBackdrop;
let tweenedModal;

export function initGameOverModal({ modalClassName }) {
  modalEl = document.querySelector(`.${modalClassName}`);
  modalBackdropEl = document.querySelector('.modal_backdrop');
  modalScoreEl = modalEl.querySelector('.modal_score');
  tweenedModalBackdrop = css(modalBackdropEl);
  tweenedModal = css(modalEl);

  const submitBtn = modalEl.querySelector('.mbs');
  const cancelBtn = modalEl.querySelector('.mbr');

  submitBtn.addEventListener('click', handleSubmit);
  cancelBtn.addEventListener('click', restartGame);

  function startGameOver() {
    pubsub.publish('gameOverModal:restart');
  }

  function handleSubmit() {
    const name = window.prompt('Please enter your nickname'); // eslint-disable-line

    if (!name) {
      restartGame();
      return;
    }

    saveScore({ name, score: getMoves() }).then(() => {
      closeModal();
      resetMoves();
      pubsub.publish('gameOverModal:show:retry:scene');
    });
  }

  function restartGame() {
    closeModal();
    resetMoves();
    startGameOver();
  }
}

export function openGameOverModal() {
  modalScoreEl.textContent = `Moves: ${getMoves()}`;

  tweenedModalBackdrop.set('x', 0);

  tweenedModal.set({
    x: 0,
    scale: 0,
  });

  spring({
    mass: 1,
    stiffness: 2000,
    damping: 30,
    to: 1,
    onUpdate: scale => tweenedModal.set('scale', scale),
  }).start();
}

function closeModal() {
  tweenedModalBackdrop.set('x', '-100%');
  tweenedModal.set('x', '-100%');
}
