import MessageWidget from './components/message-widget/MessageWidget';

const root = document.querySelector('.root');

// const path = 'http://localhost:5000/messages/unread';
const path = 'https://express-back-v3e5.onrender.com/messages/unread';

const messageWidget = new MessageWidget(root, path);
messageWidget.bindToDOM();
