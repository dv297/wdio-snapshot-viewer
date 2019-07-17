import GithubService from '../../utils/GithubService';

/**
 * @license
 * Copyright &copy 2019 Cerner Corporation
 *
 * @author Daniel Vu
 */

export default (req, res) => {
  const { url, filename } = req.query;

  if (!url) {
    res.statusCode = 400;
    res.send({
      status: 'error',
      message: 'url query parameter not provided',
    });
  }

  if (!filename) {
    res.statusCode = 400;
    res.send({
      status: 'error',
      message: 'filename parameter not provided',
    });
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  GithubService.getMasterBranchData(url, filename)
    .then((result) => {
      res.end(JSON.stringify(result));
    })
    .catch((err) => {
      res.end(JSON.stringify(err));
    });
};
