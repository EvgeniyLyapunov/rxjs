import moment from 'moment/moment';
import './message.css';

class Message {
	constructor(parentElement, data) {
		this.parentElement = parentElement;
		this.data = data;

		this.element = null;

		this.markUp = this.markUp.bind(this);
		this.bindToDOM = this.bindToDOM.bind(this);
		this.setTopicLength = this.setTopicLength.bind(this);
	}

	setTopicLength() {
		return this.data.subject.length <= 15
			? this.data.subject
			: this.data.subject.slice(0, 15) + '...';
	}

	markUp() {
		return `
      <div class="message__info-block message__info-block_from">
        <span class="message__info-label">from:</span>
        <span class="message__info-value">${this.data.from}</span>
      </div>
      <div class="message__info-block message__info-block_topic">
        <span class="message__info-label">topic:</span>
        <span class="message__info-value">${this.setTopicLength()}</span>
      </div>
      <div class="message__info-block message__info-block_received">
        <span class="message__info-label">received:</span>
        <span class="message__info-value">${moment
					.unix(this.data.received / 1000)
					.format('HH:mm DD.MM.YY')}</span>
      </div>
    `;
	}

	bindToDOM() {
		this.element = document.createElement('li');
		this.element.classList.add('message');
		this.element.innerHTML = this.markUp();

		this.parentElement.insertAdjacentElement('afterbegin', this.element);
	}
}

export default Message;
