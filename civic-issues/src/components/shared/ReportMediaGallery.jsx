import React, { useState } from 'react';
import Modal from '../common/Modal';

/**
 * Media gallery for report images, videos, and audio.
 */
const ReportMediaGallery = ({ media }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (
    !media ||
    (!media.images?.length && !media.videos?.length && !media.audio?.length)
  ) {
    return null;
  }

  const { images = [], videos = [], audio = [] } = media;

  return (
    <div className="space-y-6">
      {/* Images */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(image.url)}
              >
                <img
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Videos ({videos.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <div key={index} className="bg-black rounded-lg overflow-hidden">
                <video controls preload="metadata" className="w-full">
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio */}
      {audio.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Audio ({audio.length})
          </h4>
          <div className="space-y-2">
            {audio.map((audioFile, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <audio controls className="w-full">
                  <source src={audioFile.url} type="audio/mpeg" />
                  Your browser does not support audio playback.
                </audio>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image lightbox modal */}
      {selectedImage && (
        <Modal isOpen={true} onClose={() => setSelectedImage(null)} size="xl">
          <img
            src={selectedImage}
            alt="Full size"
            className="w-full h-auto rounded-lg"
          />
        </Modal>
      )}
    </div>
  );
};

export default ReportMediaGallery;
