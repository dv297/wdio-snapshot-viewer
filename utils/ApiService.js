/**
 * @license
 * Copyright &copy 2019 Cerner Corporation
 *
 * @author Daniel Vu
 */

import axios from 'axios';

const ApiService = {
  getPullRequestData: (pullRequestUrl) => {
    return new Promise(async (resolve, reject) => {
      if (!pullRequestUrl) {
        reject('Pull Request URL not provided');
      }

      const apiRoute = `/api/snapshots?url=${pullRequestUrl}`;
      axios.get(apiRoute).then(result => result.data).then(resolve).catch(reject);
    });
  },
  getMasterBranchData: (pullRequestUrl, filename) => {
    return new Promise((resolve, reject) => {
      if (!pullRequestUrl || !filename) {
        reject('Pull Request URL or filename not provided');
      }

      const apiRoute = `/api/branch?url=${pullRequestUrl}&filename=${filename}`;
      axios.get(apiRoute).then(result => result.data).then(resolve).catch(reject);
    });
  },
};

export default ApiService;
