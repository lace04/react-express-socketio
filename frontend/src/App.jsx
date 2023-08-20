import { useEffect } from 'react';
import { useState } from 'react';
import io from 'socket.io-client';

const socket = io('/');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      body: message,
      from: 'Me',
    };
    setMessages([...messages, newMessage]);
    socket.emit('message', message);
  };

  useEffect(() => {
    socket.on('message', receiveMessage);
    // console.log(message);
    return () => socket.off('message', receiveMessage);
  }, []);

  const receiveMessage = (message) =>
    setMessages((state) => [...state, message]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='bg-zinc-800 p-4 rounded-md flex flex-col w-1/2 mx-auto mt-20'
      >
        <h1 className='text-2xl text-center my-2'>Chat React + Socket.io</h1>
        <input
          type='text'
          placeholder='Write your message ...'
          className='bg-zinc-700 rounded-md p-2'
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700  rounded-md p-2 mt-2'
        >
          Send
        </button>

        <h2 className='text-center mt-5'>Chat: </h2>
        <ul className='flex flex-col gap-y-2 mt-2 bg-gray-900 rounded-md p-4'>
          {messages.map((message, index) => (
            <li
              key={index}
              className={`
           my-2 p-2 table text-sm rounded-md ${
             message.from === 'Me'
               ? 'ml-auto bg-sky-600'
               : 'mr-auto bg-slate-600'
           }          `}
            >
              <div className='flex flex-col'>
                <span className='font-semibold text-xs text-zinc-300'>
                  {message.from}
                </span>
                <span>{message.body}</span>
              </div>
            </li>
          ))}
        </ul>
      </form>
    </>
  );
}

export default App;
