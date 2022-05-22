import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from '@chatscope/chat-ui-kit-react';
import { useEffect, useState, useCallback } from 'react';

import { Waku } from 'js-waku';
import { ContentTopic, sendMessage, SimpleChatMessage } from '../../utils';

export const Chat = () => {
  const [waku, setWaku] = useState(undefined);
  const [wakuStatus, setWakuStatus] = useState('None');
  const [sendCounter, setSendCounter] = useState(0);
  const [messages, setMessages] = useState([]);

  const sendMessageOnClick = (message) => {
    if (wakuStatus !== 'Ready') return;

    sendMessage(message, waku, new Date()).then(() =>
      console.log('Message sent')
    );
    setSendCounter(sendCounter + 1);
  };

  const processIncomingMessage = useCallback((wakuMessage) => {
    if (!wakuMessage.payload) return;

    const { text, timestamp } = SimpleChatMessage.decode(wakuMessage.payload);

    const time = new Date();
    time.setTime(timestamp);

    const message = { text, timestamp: time };

    setMessages((messages) => {
      return [message].concat(messages);
    });
  }, []);

  useEffect(() => {
    if (!!waku) return;
    if (wakuStatus !== 'None') return;

    setWakuStatus('Starting');

    Waku.create({ bootstrap: { default: true } }).then((waku) => {
      setWaku(waku);
      setWakuStatus('Connecting');
      waku.waitForRemotePeer().then(() => {
        setWakuStatus('Ready');
      });
    });
  }, [waku, wakuStatus]);

  useEffect(() => {
    if (!waku) return;

    waku.relay.addObserver(processIncomingMessage, [ContentTopic]);

    return function cleanUp() {
      waku.relay.deleteObserver(processIncomingMessage, [ContentTopic]);
    };
  }, [waku, wakuStatus, processIncomingMessage]);

  return (
    <div style={{ flex: 1, backgroundColor: '#151515' }}>
      <MainContainer>
        <ChatContainer style={{ backgroundColor: '#151515' }}>
          <MessageList scrollBehavior='smooth'>
            {messages.map((m, i) => (
              <Message
                key={i}
                model={{
                  message: m.text,
                  sentTime: m.timestamp.toString(),
                  sender: 'Joe2',
                }}
              />
            ))}
          </MessageList>
          <MessageInput
            placeholder='Type message here'
            onSend={sendMessageOnClick}
            disabled={wakuStatus !== 'Ready'}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
