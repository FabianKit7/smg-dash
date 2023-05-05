import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { FaTimesCircle } from "react-icons/fa";
import "../styles/welcomeModal.css"

export default function WelcomeModal({ show, onHide, setShowWelcomeModal }) {
  // props => show and onHide
  useEffect(() => {
    if (typeof window !== "undefined") {
      const el = document.querySelector('.modal-content')
      if (el) {
        el.classList.add('welcome-modal-content')
      }
    }
  }, [])

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{
        border: '10px solid black'
      }}
    >
      <div className="absolute top-2 right-2">
        <FaTimesCircle className="cursor-pointer" onClick={() => setShowWelcomeModal(false)} />
      </div>

      <div className="flex flex-col items-center gap-4 pt-3 pb-5">
        <div className="flex items-center justify-center">
          <img src="/sproutysocial-light.svg" alt="logo" className="h-[40px]" />
        </div>

        <h1 className="font-bold font-MontserratBold text-3xl">HOW TO START</h1>

        <ol type="1" className="flex flex-col items-center gap-4 text-lg">
          <li>1. Connect Your Instagram Account to our service</li>
          <li>2. Put in your targets (please use over 10 for optimal results)</li>
          <li>3. Enjoy the result, we recommend changing target every month</li>
        </ol>
      </div>
    </Modal>
  );
}