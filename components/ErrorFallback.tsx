import React from 'react';

type ErrorFallbackProps = {
  message: string;
};

export default function ErrorFallback({ message }: ErrorFallbackProps) {
  return <div className='p-4 text-red-600 bg-red-50 rounded'>{message}</div>;
}
