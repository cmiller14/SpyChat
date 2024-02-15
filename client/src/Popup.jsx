import React from "react";
export default Popup

function Popup(props) {
    return (props.trigger) ? (
      <div className="popup">
        <div className="popup-inner">
            <h2>
                {props.title}
            </h2>
            <p>
                {props.text}
            </p>
            <form id="popup-pass">
                <label>
                    Password: 
                    <input 
                        type="text"
                        value={props.password}
                        onChange={e => props.setPassword(e.target.value)}
                    >
                    </input>
                </label>
            </form>
            <button className="close-btn" onClick={() => props.decrypt(props.uid)}>submit</button>
            <button className="close-btn" onClick={() => props.close()}>Close</button>
        </div>
      </div>
    ) : "";
  }
