import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { formatDistance } from "date-fns";
import { Link } from "react-router-dom";
import UserContext from "../../context/user";
import { deleteComment } from "../../services/firebase";
import AddComment from "./add-comment";

const Comments = ({ docId, comments: allComments, posted, commentInput }) => {
  const [comments, setComments] = useState(allComments);
  const [showAll, setShowAll] = useState(false);
  const { user } = useContext(UserContext);

  const handleDeleteComment = async (commentToDelete) => {
    try {
      await deleteComment(docId, commentToDelete);
      setComments(prev => prev.filter(comment => 
        !(comment.displayName === commentToDelete.displayName && 
          comment.comment === commentToDelete.comment)
      ));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  return (
    <>
      <div className='p-4 pt-1 pb-4'>
        {comments.length >= 3 && (
          <button
            type="button"
            className='text-sm text-gray-base dark:text-gray-400 mb-1 cursor-pointer'
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? 'Hide comments' : `View all ${comments.length} comments`}
          </button>
        )}
        {(showAll ? comments : comments.slice(0, 3)).map((item) => (
          <div key={`${item.comment} - ${item.displayName}`} className='mb-1 flex items-center justify-between group'>
            <p className='flex-1'>
              <Link to={`/p/${item.displayName}`}>
                <span className='mr-1 font-bold text-gray-900 dark:text-gray-100'>{item.displayName}</span>
                <span className='text-gray-900 dark:text-gray-100'>{item.comment}</span>
              </Link>
            </p>
            {user?.displayName === item.displayName && (
              <button
                onClick={() => handleDeleteComment(item)}
                className='opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-red-500 transition-opacity'
                title='Delete comment'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
              </button>
            )}
          </div>
        ))}
        <p className='text-gray-base dark:text-gray-400 uppercase text-xs mt-2'>
          {formatDistance(posted, new Date())} ago
        </p>
      </div>
      <AddComment
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
};

export default Comments;

Comments.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  posted: PropTypes.number.isRequired,
  commentInput: PropTypes.object.isRequired,
};