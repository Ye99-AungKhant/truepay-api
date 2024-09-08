import React, { useState } from "react";
import "../style/modal.css";
import { BsArrowCounterclockwise, BsXLg } from "react-icons/bs";

const Modal = ({ isOpen, onClose, idImgUrl }) => {
    const [rotation, setRotation] = useState(0);

    const handleRotate = () => {
        setRotation(prevRotation => prevRotation + 90);
    };
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="overlay" onClick={onClose} />

            {/* Modal */}
            <div className="modal">
                <img src={idImgUrl} alt="" className="idImg"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: 'transform 0.5s ease',
                    }}
                />

                <div className="modalBtn">
                    <button onClick={handleRotate}> <BsArrowCounterclockwise /></button>
                    <button onClick={onClose}><BsXLg /></button>
                </div>

            </div>
        </>
    );
};

export default Modal;
