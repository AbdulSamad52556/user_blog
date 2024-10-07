// src/Card.jsx

import React from 'react';

const Card = ({ image, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
    <div className="h-60 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-4 flex-grow flex flex-col">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 flex-grow overflow-y-auto">{description}</p>
    </div>
  </div>
  );
};

export default Card;
