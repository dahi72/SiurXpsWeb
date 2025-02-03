import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Message, Send, Close } from '@mui/icons-material';
import { IconButton, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@mui/material';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://siurxpss.azurewebsites.net/chatHub', {
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
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ backgroundColor: '#80d0f7', color: '#fff' }}>
            Chat
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setIsOpen(false)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: '#e0f7fa', paddingBottom: 2 }}>
            <div className="flex flex-col space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.user === 'Usuario' ? 'items-end' : 'items-start'}`}
                >
                  <Paper
                    sx={{
                      maxWidth: '80%',
                      padding: 2,
                      backgroundColor: msg.user === 'Usuario' ? '#00796b' : '#fff',
                      color: msg.user === 'Usuario' ? '#fff' : '#004d40',
                    }}
                  >
                    <p>{msg.text}</p>
                  </Paper>
                  <span style={{ fontSize: '0.8rem', color: '#00796b' }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#e0f7fa' }}>
            <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
              <TextField
                variant="outlined"
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                size="small"
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 2,
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ padding: 1.5, borderRadius: '50%' }}
              >
                <Send />
              </Button>
            </form>
          </DialogActions>
        </Dialog>
      ) : (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            backgroundColor: '#00796b',
            color: '#fff',
            borderRadius: '50%',
            boxShadow: 3,
            '&:hover': { backgroundColor: '#004d40' },
          }}
        >
          <Message />
        </IconButton>
      )}
    </div>
  );
};
