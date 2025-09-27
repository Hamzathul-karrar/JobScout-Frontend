import React, { useState } from 'react';
import './BuyMeCoffee.css';

const BuyMeCoffee = ({ imagePath = "src/assets/buymeacoffee.jpg" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Restore background scrolling
    document.body.style.overflow = 'unset';
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <>
      <button 
        className="buy-coffee-btn"
        onClick={openModal}
        aria-label="Support with Buy Me a Coffee"
      >
        <span className="coffee-icon"></span>
        <span className="coffee-text">Buy me a coffee</span>
      </button>

      {isModalOpen && (
        <div 
          className="coffee-modal-overlay"
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="coffee-modal-title"
        >
          <div className="coffee-modal-content">
            <div className="coffee-modal-header">
              <h2 id="coffee-modal-title">Support Me </h2>
              <button 
                className="close-btn"
                onClick={closeModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="coffee-modal-body">
              <p>Scan the QR code below to buy me a coffee!</p>
              <div className="qr-container">
                <img 
                  src={imagePath}
                  alt="Buy Me a Coffee QR Code"
                  className="qr-image"
                  onError={(e) => {
                    e.target.alt = "QR code failed to load";
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(BuyMeCoffee);
