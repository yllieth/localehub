const ERRORS = {
  "404-001": {
    message: "Unable to fetch the list of projects",
    debug: "Please check your internet connection",
    redirections: [
      { name: "Retry", route: '/projects' }
    ]
  },
  "404-002": {
    message: "The selected branch (${lastActiveBranch}) does not appear in the up-to-date list of branches: ${updatedBranchlist}",
    debug: "Wait until this feature is fully available",
    redirections: [
      { name: "Back to the projects list", route: '/projects'}
    ]
  },
  "404-003": {
    message: "Unable to fetch the list of branches for the project ${repo}",
    debug: "Please check your internet connection",
    redirections: [
      { name: "Back to the projects list", route: '/projects' }
    ]
  },
  "404-004": {
    message: "Unable to remove project ${name}",
    redirections: [
      { name: "Back to the projects list", route: '/projects' }
    ]
  },
  "422-001": {
    message: "Login failed due to a badly formatted token. ${token} is not a valid token",
    redirections: [
      { name: "Back to login page.", route: '/login' }
    ]
  }
};

export class ApplicationError {
  id: string;
  userMessage: string;
  debug: string;
  errorId: number;
  errorType: number;
  metadata: any;
  hasDebug: boolean;
  redirections: any[];

  constructor(id: string, metadata: any) {
    this.id = id;
    this.errorType = parseInt(id.split('-')[0]);
    this.errorId = parseInt(id.split('-')[1]);
    this.metadata = metadata;

    if (ERRORS.hasOwnProperty(id) === true) {
      this.userMessage = this.replaceVars(ERRORS[id].message);
      this.debug = (ERRORS[id].hasOwnProperty('debug') === true)
        ? this.replaceVars(ERRORS[id].debug)
        : this.replaceVars(ERRORS[id].message);
      this.hasDebug = (ERRORS[id].hasOwnProperty('debug') === true);
      this.redirections = (ERRORS[id].hasOwnProperty('redirections') === true) ? ERRORS[id].redirections : [];
    } else {
      this.userMessage = "Undefined error.";
      this.debug = "Undefined error.";
      this.hasDebug = false;
      this.redirections = [];
    }
  }

  /* TODO: Improve replacement: for now, I loop over metadata properties and replace ${key} by the value. It's more correct to loop over ${vars} pattern and search the value in the metadata object */
  replaceVars(message: string): string {
    for (let key in this.metadata) {
      message = message.replace('${' + key + '}', this.metadata[key]);
    }

    return message
  }
}