import React, { useState, useRef, useEffect } from 'react';

const Card = ({ title, content, actions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);
  const contentRef = useRef(null);

  const minContentHeight = 100; // pixels for content area when collapsed
  const descriptionLimit = 150; // characters for initial truncation

  useEffect(() => {
    if (contentRef.current) {
      // Check if content overflows and requires 'Read more' functionality
      const isOverflowing = contentRef.current.scrollHeight > minContentHeight || 
                           content.length > descriptionLimit;
      setNeedsReadMore(isOverflowing);
    }
  }, [content]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-base-100 shadow-md rounded-lg p-6 flex flex-col w-full max-w-full border border-gray-300 ${isExpanded ? 'h-auto' : 'h-[300px]'}`}>
      {/* Title */}
      <h3 className="text-white-700 font-semibold mb-4">{title}</h3>
      
      {/* Content container */}
      <div 
        ref={contentRef}
        className={`text-white-700 mb-4 transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-none' : 'max-h-[100px] overflow-hidden'
        }`}
        style={{
          width: '100%',  // Ensures content stretches within card bounds
          wordWrap: 'break-word', // Ensures long words break and don’t overflow
        }}
      >
        {isExpanded ? (
          <p>{content}</p>
        ) : (
          <p>
            {content.length > descriptionLimit 
              ? content.substring(0, descriptionLimit) + '...' 
              : content}
          </p>
        )}
      </div>

      {/* Read more/less button */}
      {needsReadMore && (
        <button
          onClick={handleToggleExpand}
          className="text-blue-500 hover:underline self-start mb-4"
        >
          {isExpanded ? 'Read less' : 'Read more'}
        </button>
      )}

      {/* Actions */}
      <div className="flex space-x-2 mt-auto">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`px-4 py-2 rounded-md text-white ${
              action.type === 'primary' ? 'bg-blue-500' : 'bg-red-500'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Card;
