import React, { useState } from 'react';
import './reset.css';
import './style.css';

import SearchBar from './SearchBar';
import Results from './Results';

function App() {
  const [pullRequestUrl, setPullRequestUrl] = useState('');

  return (
    <div className="app">
      <article className="app-instructions">
        <h1>Webdriver.io Snapshot Viewer</h1>
        <p>
          Use this tool to see WDIO snapshots side-by-side. Compare the incoming changes from a pull request to what was
          committed to master
        </p>
      </article>
      <div className="search-bar-container">
        <SearchBar
          onSubmit={(url) => {
            setPullRequestUrl(url);
          }}
        />
      </div>
      <div className="results-container">{pullRequestUrl && <Results url={pullRequestUrl} />}</div>
    </div>
  );
}

export default App;
