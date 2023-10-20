import MessageService from '../../MessageService';
import Message from '../message/Message';
import ViewMessage from '../view-message/ViewMessage';
import moment from 'moment/moment';

import './message-widget.css';

class MessageWidget {
	constructor(parentElement, path) {
		this.parentElement = parentElement;
		this.path = path;
		this.messageService = new MessageService(this.path);
		this.stream$ = null;
		this.subscribeToReceive = null;

		this.widgetElement = null;
		this.messagesList = null;
		this.fullMessageContainer = null;
		this.btnOn = null;
		this.btnOff = null;

		this.countInfo = null;
		this.timeStart = null;
		this.timeReceived = null;

		this.bindToDOM = this.bindToDOM.bind(this);
		this.startReceiveMessages = this.startReceiveMessages.bind(this);
		this.stoptReceiveMessages = this.stoptReceiveMessages.bind(this);
		this.renderMessage = this.renderMessage.bind(this);
		this.onViewFullMessage = this.onViewFullMessage.bind(this);
	}

	markUp() {
		return `
			<header class="header">
				<h1 class="title">Incoming messages</h1>
				<div class="control-panel">
					<div class="control-panel__btns-block">
						<button class="control-panel__btn control-panel__btn_on">
							download unread messages
							<span class="control-panel__btn-active"></span>
						</button>
						<button class="control-panel__btn control-panel__btn_off">stop download unread messages</button>
						<span class="control-panel__info-label">number of messages received</span>
						<span class="control-panel__info-value control-panel__info-value_count"></span>
					</div>
					<div class="divider"></div>
					<div class="control-panel__info-block">
						<div>
							<span class="control-panel__info-label">start time of receiving messages</span>
							<span class="control-panel__info-value control-panel__info-value_time-start"></span>
						</div>
						<div>
							<span class="control-panel__info-label">time of last message received</span>
							<span class="control-panel__info-value control-panel__info-value_time-received"></span>
						</div>
					</div>
				</div>
			</header>
			<div class="message-container"></div>
			<ul class="messages-list"></ul>
		`;
	}

	bindToDOM() {
		this.widgetElement = document.createElement('div');
		this.widgetElement.classList.add('container');
		this.widgetElement.innerHTML = this.markUp();

		this.parentElement.insertAdjacentElement('beforeend', this.widgetElement);

		this.messagesList = this.widgetElement.querySelector('.messages-list');
		this.fullMessageContainer = this.widgetElement.querySelector('.message-container');
		this.btnOn = this.widgetElement.querySelector('.control-panel__btn_on');
		this.btnOff = this.widgetElement.querySelector('.control-panel__btn_off');

		this.countInfo = this.widgetElement.querySelector('.control-panel__info-value_count');
		this.countInfo.textContent = 0;
		this.timeStart = this.widgetElement.querySelector('.control-panel__info-value_time-start');
		this.timeStart.textContent = '00:00 00.00.00';
		this.timeReceived = this.widgetElement.querySelector(
			'.control-panel__info-value_time-received'
		);
		this.timeReceived.textContent = '00:00:00 00.00.00';

		this.btnOn.addEventListener('click', this.startReceiveMessages);
		this.btnOff.addEventListener('click', this.stoptReceiveMessages);
		this.btnOff.setAttribute('disabled', true);
	}

	startReceiveMessages() {
		this.btnOn.querySelector('span').classList.add('control-panel__btn-active_on');
		this.btnOn.setAttribute('disabled', true);
		this.btnOff.removeAttribute('disabled');
		this.timeStart.textContent = moment().format('HH:mm DD.MM.YY');
		this.stream$ = this.messageService.strim$();
		this.subscribeToReceive = this.stream$.subscribe((value) => {
			this.renderMessage(value);
		});
	}

	stoptReceiveMessages() {
		this.btnOn.querySelector('span').classList.remove('control-panel__btn-active_on');
		this.btnOn.removeAttribute('disabled');
		this.btnOff.setAttribute('disabled', true);
		this.subscribeToReceive.unsubscribe();
		this.stream$ = null;
	}

	renderMessage(value) {
		if (value.length === 0) {
			return;
		}

		value.forEach((item) => {
			new Message(this.messagesList, item, this).bindToDOM();
		});

		this.countInfo.textContent = this.messagesList.querySelectorAll('li').length;
		this.timeReceived.textContent = moment().format('HH:mm:ss DD.MM.YY');
	}

	onViewFullMessage(data) {
		new ViewMessage(this.fullMessageContainer, data).bindToDOM();
	}
}

export default MessageWidget;
