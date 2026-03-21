import React from 'react';

function Loading({ message = 'Loading...' }) {
  return (
    <div className='flex flex-col items-center justify-center py-20'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4'></div>
      <p className='text-gray-600 text-lg'>{message}</p>
    </div>
  );
}

export default Loading;