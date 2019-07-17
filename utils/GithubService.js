import axios from 'axios';
import parseLinkHeader from './parseLinkHeader';

const getParsedProjectInfo = (pullRequestUrl) => {
  let [baseUrl, projectPath] = pullRequestUrl.split('.com');
  const [_, owner, project, _1, pullRequestNumber] = projectPath.split('/');
  baseUrl += '.com';

  return {
    baseUrl,
    owner,
    project,
    pullRequestNumber,
  };
};

const getRestAPIBaseUrl = (baseUrl) => {
  if (baseUrl === 'https://github.com') {
    return 'https://api.github.com';
  }

  return `${baseUrl}/api/v3`;
};

const GithubService = {
  getPullRequestData: (pullRequestUrl) => {
    return new Promise(async (resolve, reject) => {
      if (!pullRequestUrl) {
        reject('Pull Request URL not provided');
      }
      const { baseUrl, owner, project, pullRequestNumber } = getParsedProjectInfo(pullRequestUrl);

      const apiRoute = `${getRestAPIBaseUrl(baseUrl)}/repos/${owner}/${project}/pulls/${pullRequestNumber}/files`;

      const numberOfPages = await axios
        .head(apiRoute)
        .then((result) => {
          if (!result.headers.link) {
            return 1;
          }
          const lastRel = parseLinkHeader(result.headers.link).rels.last.href;
          return Number(lastRel.split('=')[1]);
        })
        .catch(reject);

      const allFiles = await Promise.all(
        [...Array(numberOfPages)].map((_, index) => {
          const pageNumber = index + 1;

          return axios
            .get(`${apiRoute}?page=${pageNumber}`)
            .then((result) => result.data)
            .then((data) => {
              const snapshotRegex = /__snapshots__/g;
              const wdioRegex = /wdio/g;
              const wdioEntries = data.filter(
                ({ filename }) => filename.match(snapshotRegex) && filename.match(wdioRegex),
              );
              return wdioEntries;
            })
            .catch(reject);
        }),
      )
        .then((arrays) => {
          return [].concat.apply([], arrays);
        })
        .catch(reject);

      resolve(allFiles);
    });
  },
  getMasterBranchData: (pullRequestUrl, filename) => {
    return new Promise((resolve, reject) => {
      if (!pullRequestUrl || !filename) {
        reject('Pull Request URL not provided');
      }

      const { baseUrl, owner, project } = getParsedProjectInfo(pullRequestUrl);

      const apiRoute = `${baseUrl}/api/v3/repos/${owner}/${project}/contents/${filename}`;
      resolve(axios.get(apiRoute).then((result) => result.data));
    });
  },
};

export default GithubService;
