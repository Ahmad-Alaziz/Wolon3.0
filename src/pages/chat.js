import React, { useState } from 'react';
import ActivityIndicator from '../components/ActivityIndicator';

function Chat() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return <>Helooooo I am in chat</>;
}

export default Chat;
