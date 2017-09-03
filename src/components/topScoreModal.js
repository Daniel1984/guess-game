import { css, spring } from 'popmotion';
import { getAllUsers } from '../firebase';

let modalEl;
let modalBackdropEl;
let modalContentEl;
let tweenedModalBackdrop;
let tweenedModal;

export function initTopScoreModal({ modalClassName }) {
  modalEl = document.querySelector(`.${modalClassName}`);
  modalBackdropEl = document.querySelector('.modal_backdrop');
  modalContentEl = modalEl.querySelector('.modal_score-results-body');
  tweenedModalBackdrop = css(modalBackdropEl);
  tweenedModal = css(modalEl);

  const cancelBtn = modalEl.querySelector('.modal_button--close');

  cancelBtn.addEventListener('click', closeModal);
}

export function openTopScoreModal() {
  getAllUsers().then((users) => {
    modalContentEl.innerHTML = '';

    users.forEach(({ name, score }, index) => {
      const userRow = document.createElement('div');
      userRow.className = 'modal_result-row modal_result-row--striped';

      userRow.innerHTML = `
        <div class="modal_result-row-item">#${index + 1}</div>
        <div class="modal_result-row-item">${name}</div>
        <div class="modal_result-row-item">${score}</div>
      `;

      modalContentEl.appendChild(userRow);
    });
  });

  tweenedModalBackdrop.set('x', 0);
  tweenedModal.set({
    x: 0,
    scale: 0,
  });

  spring({
    mass: 1,
    stiffness: 1800,
    damping: 40,
    to: 1,
    onUpdate: scale => tweenedModal.set('scale', scale),
  }).start();
}

function closeModal() {
  tweenedModalBackdrop.set('x', '-100%');
  tweenedModal.set('x', '-100%');
}
