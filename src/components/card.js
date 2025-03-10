import React, { useState, useRef, useEffect } from 'react';

const Card = ({ title, content, actions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);
  const contentRef = useRef(null);
  
  // Minimum height for collapsed state
  const minContentHeight = 100; // pixels
  const descriptionLimit = 150; // characters for initial truncation

  // Check if content needs "Read more" button
  useEffect(() => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > minContentHeight || 
                          content.length > descriptionLimit;
      setNeedsReadMore(isOverflowing);
    }
  }, [content]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col w-full max-w-md">
      {/* Title */}
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      {/* Content container with dynamic height */}
      <div 
        ref={contentRef}
        className={`text-gray-700 mb-4 transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-none' : 'max-h-[100px] overflow-hidden'
        }`}
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

// Example usage:
const App = () => {
  const sampleActions = [
    { label: 'Edit', type: 'primary', onClick: () => console.log('Edit clicked') },
    { label: 'Delete', type: 'secondary', onClick: () => console.log('Delete clicked') },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Card
        title="Short Content"
        content="This is a short description."
        actions={sampleActions}
      />
      <Card
        title="Long Content"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        actions={sampleActions}
      />
    </div>
  );
};

export default Card;