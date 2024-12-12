import React from 'react';
import SignupForm from './SignupForm';

export default function Page() {
  return (
    <div className="min-h-screen bg-[url('/image/Acity.jpg')] bg-cover bg-no-repeat flex justify-center items-center px-6 py-12">
        <a href='/'>
        <img src='/sponsor.png'
        width={256}
        height={256}
        className='absolute p-8 left-0 top-0 z-50' />
        </a>
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg">
        <h2 className="text-4xl font-semibold text-center text-gray-900 mb-8">Create an Account</h2>
        <SignupForm />
      </div>
    </div>
  );
}
