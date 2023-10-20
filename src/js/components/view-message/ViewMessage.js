import moment from 'moment/moment';

import './view-message.css';

class ViewMessage {
	constructor(parentElement, messageData) {
		this.parentElement = parentElement;
		this.messageData = messageData;

		this.element = null;
		this.closeBtn = null;

		this.markUp = this.markUp.bind(this);
		this.bindToDOM = this.bindToDOM.bind(this);
		this.onClose = this.onClose.bind(this);
	}

	markUp() {
		return `
      <div class="read-message__received">
        <span class="read-message__label">received:</span>
        <span>${moment.unix(this.messageData.received / 1000).format('HH:mm DD.MM.YY')}</span>
      </div>
      <div class="read-message__from">
        <span class="read-message__label">from:</span>
        <span>${this.messageData.from}</span>
      </div>
      <div class="read-message__topic">
        <span class="read-message__label">topic:</span>
        <span>${this.messageData.subject}</span>
      </div>
      <div class="read-message__text">
        <span class="read-message__label">text:</span>
        <span>${this.messageData.body}</span>
      </div>
      <button class="read-message__close">close</button>
    `;
	}

	bindToDOM() {
		this.element = document.createElement('div');
		this.element.classList.add('read-message');
		this.element.innerHTML = this.markUp();

		this.parentElement.innerHTML = '';
		this.parentElement.insertAdjacentElement('afterbegin', this.element);

		this.closeBtn = this.element.querySelector('button');
		this.closeBtn.addEventListener('click', this.onClose);
	}

	onClose() {
		this.element.remove();
		this.element = null;
	}
}

export default ViewMessage;
