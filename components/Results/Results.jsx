/**
 * @license
 * Copyright &copy 2019 Cerner Corporation
 *
 * @author Daniel Vu
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';

import './Results.css';
import Result from './Result';
import ApiService from '../../utils/ApiService';

const Results = ({ url }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pullRequestChangedFiles, setPullRequestChangedFiles] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    ApiService.getPullRequestData(url)
      .then((changedFiles) => {
        console.log(changedFiles);
        const files = changedFiles.map(({ filename, raw_url }) => ({ filename, after: raw_url }));
        Promise.all(
          files.map((file) =>
            ApiService.getMasterBranchData(url, file.filename)
              .then((entry) => entry.download_url)
              .catch(() => {
                return Promise.resolve(null);
              }),
          ),
        ).then((masterFiles) => {
          masterFiles.forEach((masterFile, index) => {
            files[index].before = masterFile;
          });
          setPullRequestChangedFiles(files);
        });
      })
      .catch((e) => {
        console.log(e);
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url]);

  if (hasError) {
    return (
      <div className="results-error-container">
        <h1>There was an issue retrieving results, please check your URL and try again.</h1>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingOverlay active={isLoading} spinner text="Loading your content..." />;
  }

  if (pullRequestChangedFiles && pullRequestChangedFiles.length < 0) {
    return null;
  }

  return (
    <div>
      {pullRequestChangedFiles.map((entry) => (
        <Result before={entry.before} after={entry.after} filename={entry.filename} key={entry.filename} />
      ))}
    </div>
  );
};

Results.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Results;
