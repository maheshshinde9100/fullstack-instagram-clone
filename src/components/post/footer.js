import React from "react";
import PropTypes from "prop-types";

const Footer = ({ caption, username }) => {
  return (
    <div className='p-4 pt-2 pb-0'>
      <span className='mr-1 font-bold text-gray-900 dark:text-gray-100'>{username}</span>
      <span className='text-gray-900 dark:text-gray-100'>{caption}</span>
    </div>
  );
};

export default Footer;

Footer.propTypes = {
  caption: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};