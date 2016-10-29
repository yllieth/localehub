const ERRORS = {
  "404-001": {
    message: "Unable to fetch the list of projects",
    debug: "Please check your internet connection"
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
    } else {
      this.userMessage = "Undefined error.";
      this.debug = "Undefined error.";
      this.hasDebug = false;
    }
  }
}