/* eslint-disable no-use-before-define */
/**
 *
 * This is a VanillaJS version of the bootstrap modal (no need for jQuery nor any other js)
 *
 * Just import modal from './modal', call modal() to init it
 * Then to use it:
 *
 * import { show } from './modal'
 * const hide = show();
 * hide();// if you want to hide the modal yourself
 *
 */
import template from './template.html';

const MODAL_TRANSITION_DURATION = 300;
const MODAL_BACKDROP_TRANSITION_DURATION = 150;

let bootstrapModal;
let bootstrapModalBackdrop;

const init = () => {
  const body = document.getElementsByTagName('body')[0];
  const modalNode = document.createElement('div');
  modalNode.id = 'modal-node';
  modalNode.innerHTML = template;
  bootstrapModal = modalNode.querySelector('.modal');
  bootstrapModalBackdrop = modalNode.querySelector('.modal-backdrop');
  bootstrapModal.addEventListener('click', clickToHide, false);
  body.appendChild(modalNode);
};

export default init;

const clickToHide = (e) => {
  console.log('clickToHide');
  console.log(e.target);
  if (e.target.classList.contains('close-on-click')) {
    return hide();
  }
};

/**
 * Since hide does async work on the DOM, if you call it on a cleanup task, call it with force=true
 * @param {Boolean} [force]
 */
const hide = (force = false) => {
  bootstrapModal.classList.remove('in');
  bootstrapModalBackdrop.classList.remove('in');
  if (force === false) {
    setTimeout(() => bootstrapModal.style.display = 'none', MODAL_TRANSITION_DURATION);
    setTimeout(() => bootstrapModalBackdrop.style.display = 'none', MODAL_BACKDROP_TRANSITION_DURATION);
  }
  else {
    bootstrapModal.style.display = 'none';
    bootstrapModalBackdrop.style.display = 'none';
  }
};

export const show = ({ title = '', content = '' } = {}) => {
  bootstrapModal.querySelector('.modal-title').innerHTML = title;
  bootstrapModal.querySelector('.modal-body').innerHTML = content;
  bootstrapModal.style.display = 'block';
  setTimeout(() => bootstrapModal.classList.add('in'), MODAL_TRANSITION_DURATION);
  bootstrapModalBackdrop.style.display = 'block';
  setTimeout(() => bootstrapModalBackdrop.classList.add('in'), MODAL_BACKDROP_TRANSITION_DURATION);
  return hide;
};
