import React from 'react';
import toast from './assets/toastPopup.jpg';
export default Toast;

function Toast(props) {
    return (props.trigger) ? (
        <>
            <div className="toast-popup">
                <img className="toast" src={toast} alt="toast popup"></img>
                <button className="close-btn" onClick={() => props.close()}>Close</button>
            </div>

        </>
    ) : "";
}




