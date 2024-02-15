import { useEffect, useState } from 'react';
import './App.css';
import {io} from "socket.io-client";
import Message from './Message'
import Popup from './Popup';
import Toast from './Toast';
import SimpleCrypto from 'simple-crypto-js';
import {v4 as uuidv4} from 'uuid';
// 144.39.198.208
function App() {
  const [socket, setSocket] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [password, setPassword] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);
  const [toastPopup, setToastPopup] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [uuid, setUuid] = useState("");

  useEffect(() => {
    const s = io();
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const callback = (message) => {
      const title =  message[0];
      const content = message[1];
      const encryptedContent = message[2];
      const password = message[3];
      const id = message[4];
      setMessages([...messages, {title, content, encryptedContent, password, id}]);
    }
    
    socket.on("new message", callback);

    return () => {
      socket.off("new message", callback);
    }

  }, [socket, messages]);


  function save() {
    if (title && content && password) {
      const simpleCrypto = new SimpleCrypto(password);
      const text = content;
      const encryptedContent = simpleCrypto.encrypt(text);
      const id = uuidv4();

      setMessages([...messages, {title, content, encryptedContent, password, id}]);
      setTitle("");
      setContent("");
      setPassword("");

      socket.emit("message", [title, content, encryptedContent, password, id]);
      
    }

  }


  function findMessage(uid) {
    for (const message of messages) {
      if (message['id']===uid) {
        return message;
      }
    }
  }

  function launchPopup(message, title, uid) {
    setButtonPopup(true);
    setPopupText(message);
    setPopupTitle(title);
    setUuid(uid); 
  }

  function closePopup() {
    setPassword("");
    setButtonPopup(false);
  }

  function closeToast() {
    setPassword("");
    setToastPopup(false);
  }

  function unencrypt(uid) {
    const simpleCrypto = new SimpleCrypto(password);
    // get the correct message
    const message = findMessage(uid);
    const text = message['encryptedContent'];
    try{
      const decodedText = simpleCrypto.decrypt(text);
      setPopupText(decodedText);
    } catch (error) {
      console.log("you did not provide the right password!");
      setToastPopup(true);
    }
  }


  return (
    <>
      <h1>Spy Chat</h1>
      <div className="user-input-area">
      <form className="note-form">
        <label>
          Message Subject
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            />
        </label>
        <label>
          Message Content 
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            />
        </label>
        <label>
          Password
          <input
          id="password"
          type="text"
          value={password}
          onChange={e => setPassword(e.target.value)}
          />
        </label>
        <button type="button" className="btn-primary" onClick={save}>
          Send Message
        </button>
      </form>
      </div>
      <div>
        {
          messages.map((message) => (
            <Message 
            key={message.id}
            uid={message.id}
            title={message.title}
            message={"Encryped message"} 
            setTrigger={launchPopup}/>
          ))
        }
      </div>
      <div>
        <Popup
          uid={uuid}
          trigger={buttonPopup} 
          decrypt={unencrypt}
          password={password}
          setPassword={setPassword}
          text={popupText}
          title={popupTitle}
          close={closePopup}>
        </Popup>
      </div>
      <div>
        <Toast
          trigger={toastPopup}
          close={closeToast}>
        </Toast>
      </div>
    </>
  )
}

export default App
