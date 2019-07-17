/**
 * @license
 * Copyright &copy 2019 Cerner Corporation
 *
 * @author Daniel Vu
 */

import GithubService from '../../utils/GithubService';

export default (req, res) => {
  const { url } = req.query;

  if (!url) {
    res.statusCode = 400;
    res.send({
      status: 'error',
      message: 'url query parameter not provided',
    })
  }

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  GithubService.getPullRequestData(url)
    .then((result) => {
      res.end(JSON.stringify(result));
    })
    .catch((err) => {
      res.end(JSON.stringify(err));
    });

}
