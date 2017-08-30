import pubsub from 'pubsub-js';
import { css, spring } from 'popmotion';
import { getScore } from '../gameState';

let modalEl;
let modalBackdropEl;
let modalScoreEl;
let tweenedModalBackdrop;
let tweenedModal;

export function initGameOverModal({ modalClassName, modalBackdropClassName }) {
  modalEl = document.querySelector(`.${modalClassName}`);
  modalBackdropEl = document.querySelector(`.${modalBackdropClassName}`);
  modalScoreEl = modalEl.querySelector('.modal_score');
  tweenedModalBackdrop = css(modalBackdropEl);
  tweenedModal = css(modalEl);

  const submitBtn = modalEl.querySelector('.modal_button--submit');
  const cancelBtn = modalEl.querySelector('.modal_button--retry');

  submitBtn.addEventListener('click', handleSubmit);
  cancelBtn.addEventListener('click', restartGame);

  function handleSubmit() {
    console.log('submitting');
  }

  function restartGame() {
    closeModal();
  }
}

export function openGameOverModal() {
  modalScoreEl.textContent = `Moves: ${getScore()}`;
  tweenedModalBackdrop.set('x', 0);

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
