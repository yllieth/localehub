const ERRORS = {
  "404-001": {
    message: "Unable to fetch the list of projects",
    debug: "Please check your internet connection",
    redirections: [
      { name: "Retry", route: '/projects' }
    ]
  },
  "422-001": {
    message: "Login failed due to a badly formatted token. %{token} is not a valid token",
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
      this.userMessage = ERRORS[id].message;
      this.debug = (ERRORS[id].hasOwnProperty('debug') === true)
        ? ERRORS[id].debug
        : ERRORS[id].message;
      this.hasDebug = (ERRORS[id].hasOwnProperty('debug') === true);
      this.redirections = (ERRORS[id].hasOwnProperty('redirections') === true) ? ERRORS[id].redirections : [];
    } else {
      this.userMessage = "Undefined error.";
      this.debug = "Undefined error.";
      this.hasDebug = false;
      this.redirections = [];
    }
  }
}