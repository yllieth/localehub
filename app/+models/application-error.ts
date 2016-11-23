const ERRORS = {
  "404-001": {
    message: "Unable to fetch the list of projects",
    debug: "Please check your internet connection"
  },
  "404-002": {
    message: "Unable to find the project [${projectRepo}/${projectName}]",
    debug: "Click on the link below to see your existing projects and try to open your project from the list.",
    redirections: [{ name: "Your existing projects", route: "/projects" }]
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
      this.userMessage = this.replaceMetadata(ERRORS[id].message);
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

  private replaceMetadata(message): string {
    console.log(this.metadata);
    return message;
  }
}