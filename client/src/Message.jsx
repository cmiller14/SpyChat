import React from "react"
export default Message

function Message(props) {
    return (
      <div className="stuff-box" onClick={() => props.setTrigger(props.message, props.title, props.uid)}>
        <h2>{props.title}</h2>
        <p>{props.message}</p>
      </div>
    )
  }