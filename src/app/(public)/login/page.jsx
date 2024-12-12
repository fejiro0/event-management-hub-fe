'use client';

import React from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[url('/image/Acity.jpg')] bg-cover bg-no-repeat flex justify-center items-center px-6 py-12">
        <img src='/sponsor.png'
        width={256}
        height={256}
        className='absolute p-8 left-0 top-0 z-50' />
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg">
        <h2 className="text-4xl font-semibold text-center text-gray-900 mb-8">Log In</h2>
        <LoginForm />
      </div>
    </div>
  );
}
