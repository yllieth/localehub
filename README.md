# Localehub

> This application is dedicated for non-developer people who are in charge of adding/updating I18N (Internationalization) support to an existing application.
>
> **Pain #1**: Non-developer people aren't comfortable with editing codebase directly on github or within any tool or IDE that can access production code ... and they are right!!
>
> **Pain #2**: Existing tool which provide an interface to edit I18N strings doesn't support the concept of branch. As a result, when people from the marketing team edits I18N strings, an other developer may have pushed a new piece of code which overrides these editions.

**Table of content**
- [Features specification](#features-specification)
  - [v1.0](#mvp---v10)
  - [v1.1](#additional-cool-features---v11)
- [Mockups](#mockups)
  - [Login](#login)
  - [Projects list](#projects-list)
  - [String edition](#string-edition)
  - [String addition](#string-addition)
- [Project Installation](#project-installation)

## Features specification

### MVP - v1.0
- :white_check_mark: `DONE` Login to the application from a github account.
- :white_check_mark: `DONE` Create a project from an existing github repository.
- :white_check_mark: `DONE` List created projects and show the number of I18N strings, available branches, and, supported languages.
- :white_check_mark: `DONE` Save changes in the project. A pending change must belong to a branch name.
- :soon: `TODO` Preview pending changes before committing.
- :soon: `TODO` Allow the user to edit I18N files in a secured way: it must guarantee that any other file will be modified.
- :soon: `TODO` Allow the user to work on different github branches.
- :soon: `TODO` Once all modification are done, create a pull-request with -at least- one assignee.
- :soon: `TODO` Allow the user to receive notifications from github on each change on the current repository and see if it affects his current work.

### Additional cool features - v1.1

- `TODO` When the user views the list of existing translations, ha can search, open/collapse all translations, see his changes, export in different formats.
- `TODO` On a specific translation, the user can see 
  - if it contains a valid HTML tags, 
  - if this strings has pluralized version,
  - how many variable the string contains
  - how many time it is used in the code
  - usages of this translation in his code
- `TODO` Automatically find translation files according to project type (Rails, Django, Play, Symfony, ... all these frameworks have usual location for them)

## Known limitations

### Github limitations
- Impossible to work with translation files larger than 1MB (https://developer.github.com/v3/repos/contents/#get-contents)

## Mockups

### Login
![Screenshot](doc/mockups/screencapture-localhost-3000-login-1476269009581.png)

### Projects list
![Screenshot](doc/mockups/1-Projects-list.png)

### String edition
![Screenshot](doc/mockups/2-Project-edition.png)

### String addition
![Screenshot](doc/mockups/3-adding-a-locale.png)

## Project Installation

```
git clone git@github.com:yllieth/localehub-mock.git
git clone git@github.com:yllieth/localehub.git
cd localehub
npm install
npm start
```

AWS account: https://673077269136.signin.aws.amazon.com/console