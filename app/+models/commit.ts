import { Project } from './';

export interface CommitResponse {
  project: Project;
  commit: Commit[];
}

export interface Commit {
  content: {
    name: string;           // ex: "pl.json",
    path: string;           // ex: "locales/pl.json",
    sha: string;            // ex: "475e073c4a07df6d7f0e215cd947be2ced0cf4d1",
    size: number;           // ex: 1354,
    url: string;            // ex: "https://api.github.com/repos/yllieth/localehub-test/contents/locales/pl.json?ref=refs/heads/gh-test-localehub",
    html_url: string;       // ex: "https://github.com/yllieth/localehub-test/blob/refs/heads/gh-test-localehub/locales/pl.json",
    git_url: string;        // ex: "https://api.github.com/repos/yllieth/localehub-test/git/blobs/475e073c4a07df6d7f0e215cd947be2ced0cf4d1",
    download_url: string;   // ex: "https://raw.githubusercontent.com/yllieth/localehub-test/refs/heads/gh-test-localehub/locales/pl.json",
    type: string;           // ex: "file",
    _links: {
      self: string;         // ex: "https://api.github.com/repos/yllieth/localehub-test/contents/locales/pl.json?ref=refs/heads/gh-test-localehub",
      git: string;          // ex: "https://api.github.com/repos/yllieth/localehub-test/git/blobs/475e073c4a07df6d7f0e215cd947be2ced0cf4d1",
      html: string;         // ex: "https://github.com/yllieth/localehub-test/blob/refs/heads/gh-test-localehub/locales/pl.json"
    }
  },
  commit: {
    sha: string;            // ex: "0c7552541b6f8171cd90caaa840bbbfe290d80f1",
    url: string;            // ex: "https://api.github.com/repos/yllieth/localehub-test/git/commits/0c7552541b6f8171cd90caaa840bbbfe290d80f1",
    html_url: string;       // ex: "https://github.com/yllieth/localehub-test/commit/0c7552541b6f8171cd90caaa840bbbfe290d80f1",
    author: {
      name: string;         // ex: "Sylvain RAGOT",
      email: string;        // ex: "sylvnimes@hotmail.com",
      date: string;         // ex: "2017-07-03T14:11:38Z"
    },
    committer: {
      name: string;         // ex: "Sylvain RAGOT",
      email: string;        // ex: "sylvnimes@hotmail.com",
      date: string;         // ex: "2017-07-03T14:11:38Z"
    },
    tree: {
      sha: string;          // ex: "83c59a0464a6ddb2142b7e3804ef7069b134b467",
      url: string;          // ex: "https://api.github.com/repos/yllieth/localehub-test/git/trees/83c59a0464a6ddb2142b7e3804ef7069b134b467"
    },
    message: string;        // ex: "Updates locales (pl.json) via Localehub",
    parents: Array<
      {
        sha: string;        // ex: "895611439e6b8f7bd606f0a64d8fee259b3e1f52",
        url: string;        // ex: "https://api.github.com/repos/yllieth/localehub-test/git/commits/895611439e6b8f7bd606f0a64d8fee259b3e1f52",
        html_url: string;   // ex: "https://github.com/yllieth/localehub-test/commit/895611439e6b8f7bd606f0a64d8fee259b3e1f52"
      }
    >
  }
}