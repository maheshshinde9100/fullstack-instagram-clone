import React, { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import Post from './post';

const LazyPost = ({ content }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: '200px', // Start loading 200px before it enters the viewport
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} style={{ minHeight: '600px' }} className="mb-12">
            {isVisible ? (
                <Post content={content} />
            ) : (
                <div className="rounded col-span-4 border bg-white dark:bg-gray-800 border-gray-primary dark:border-gray-600">
                    {/* Skeleton matching the post layout */}
                    <div className="p-4 flex items-center">
                        <Skeleton circle width={32} height={32} className="mr-3" />
                        <Skeleton width={100} height={20} />
                    </div>
                    <Skeleton height={400} />
                    <div className="p-4">
                        <Skeleton count={2} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LazyPost;
