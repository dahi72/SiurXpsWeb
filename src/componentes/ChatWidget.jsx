import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { MessageCircle, X, Send } from 'lucide-react';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://siurxpss.azurewebsites.net/chatHub',
      {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log('Connected to SignalR Hub');
          
          connection.on('RecibirMensaje', (user, message) => {
            setMessages(prev => [...prev, {
              user,
              text: message,
              timestamp: new Date()
            }]);
          });
        })
        .catch(err => console.error('Error connecting to SignalR Hub:', err));
    }
  }, [connection]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && connection) {
      try {
        await connection.invoke('EnviarMensaje', 'Usuario', newMessage.trim());
        setNewMessage('');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-sky-50 rounded-lg shadow-xl w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="bg-sky-500 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-white font-semibold">Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-sky-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.user === 'Usuario' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.user === 'Usuario'
                      ? 'bg-sky-500 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-sky-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 rounded-full px-4 py-2 border border-sky-200 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="bg-sky-500 text-white rounded-full p-2 hover:bg-sky-600 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-sky-500 text-white rounded-full p-3 shadow-lg hover:bg-sky-600 transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};