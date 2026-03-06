import React, { useEffect } from 'react';
import Header from '../components/Header';

export default function Direct() {
    useEffect(() => {
        document.title = 'Direct - Instagram';
    }, []);

    return (
        <div className="bg-gray-background dark:bg-black min-h-screen">
            <Header />
            <div className="container mx-auto max-w-screen-lg md:h-[calc(100vh-100px)] flex border border-gray-primary dark:border-gray-800 bg-white dark:bg-gray-900 rounded-md overflow-hidden">
                <div className="w-full md:w-1/3 border-r border-gray-primary dark:border-gray-800 flex flex-col">
                    <div className="p-4 border-b border-gray-primary dark:border-gray-800 flex items-center justify-center">
                        <h2 className="font-bold text-gray-900 dark:text-gray-100">Messages</h2>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                            <p className="text-sm">No messages yet.</p>
                            <button className="mt-4 text-blue-medium font-bold text-sm">Send Message</button>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex md:w-2/3 flex-col items-center justify-center p-10 bg-white dark:bg-gray-900">
                    <div className="rounded-full border-2 border-black dark:border-white p-4 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-16 h-16 text-black dark:text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-2">Your Messages</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Send private photos and messages to a friend or group.</p>
                    <button className="mt-6 bg-blue-medium hover:bg-blue-600 text-white font-bold text-sm px-4 py-2 rounded transition-colors">
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
}
