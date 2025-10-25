import React, { useState } from 'react';

function MediaSelectionModal({ onSelectMedia, onClose }) {
  const mediaItems = [
    'https://example.com/media1.jpg',
    'https://example.com/media2.jpg',
    'https://example.com/media3.jpg',
  ];

  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleMediaSelection = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
  };

  const handleConfirmSelection = () => {
    if (selectedMedia) {
      onSelectMedia(selectedMedia);
      onClose();
    }
  };

  return (
    <div className="media-selection-modal">
      <h2>Select Media</h2>
      <ul>
        {mediaItems.map((mediaUrl) => (
          <li key={mediaUrl}>
            <img
              src={mediaUrl}
              alt="Media"
              onClick={() => handleMediaSelection(mediaUrl)}
              className={selectedMedia === mediaUrl ? 'selected' : ''}
            />
          </li>
        ))}
      </ul>
      <button onClick={handleConfirmSelection}>Select</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default MediaSelectionModal;