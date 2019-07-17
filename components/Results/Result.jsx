/**
 * @license
 * Copyright &copy 2019 Cerner Corporation
 *
 * @author Daniel Vu
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CompareImages from 'react-compare-image';

import noImageIcon from './no-image.svg';
import './Result.css';

const Result = ({ before, after, filename }) => {
  const [isSideBySide, setIsSideBySide] = useState(true);
  const toggleSideBySide = () => setIsSideBySide(!isSideBySide);

  const sideBySideComparison = (
    <div className="result-images-container">
      <label>Current Reference in Master</label>
      <label>Changes Incoming from PR</label>
      <a href={before} target="_blank">
        {before ? (
          <img src={before} alt="Current Reference in Master" />
        ) : (
          <img src={noImageIcon} style={{ width: 200, height: 200 }} />
        )}
      </a>
      <a href={after} target="_blank">
        {after ? (
          <img src={after} alt="Changes Incoming from PR" />
        ) : (
          <img src={noImageIcon} style={{ width: 200, height: 200 }} />
        )}
      </a>
    </div>
  );

  const inPlaceComparison = (
    <div>
      <CompareImages leftImage={before} rightImage={after} />
    </div>
  );

  return (
    <div className="result">
      <div className="result-filename-container">
        <h1 className="result-filename">{filename}</h1>
      </div>
      {isSideBySide ? sideBySideComparison : inPlaceComparison}
      <div className="result-controls">
        <button onClick={toggleSideBySide}>
          {isSideBySide ? 'Switch to in-place comparison' : 'Switch to side-by-side comparison'}
        </button>
      </div>
    </div>
  );
};

Result.propTypes = {
  before: PropTypes.string.isRequired,
  after: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
};

export default Result;
