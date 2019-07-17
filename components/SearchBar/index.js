import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './SearchBar.css';

const SearchBar = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const onUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(url);
  };

  return (
    <form className="search-bar" onSubmit={onFormSubmit}>
      <input value={url} placeholder="Pull Request URL" onChange={onUrlChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

SearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SearchBar;
