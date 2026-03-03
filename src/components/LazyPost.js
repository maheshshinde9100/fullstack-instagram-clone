import React, { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import Post from './post';

const LazyPost = ({ content }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const current = containerRef.current;
        if (!current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: '200px',
            }
        );

        observer.observe(current);

        return () => {
            observer.unobserve(current);
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
