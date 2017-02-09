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
- **Login**
  - :white_check_mark: `DONE` Login to the application from a github account.
- **Projects**
  - :white_check_mark: `DONE` Create a project from an existing github repository.
  - :white_check_mark: `DONE` List created projects and show the number of I18N strings, available branches, and, supported languages.
  - :soon: `TODO` Support switching github branches.
  - :white_check_mark: `DONE` Refresh the list of branches
  - :white_check_mark: `DONE` Delete a project
- **Translations**
  - :white_check_mark: `DONE` List all translations of an i18n files with a tree representing the structure of the json object.
  - :soon: `TODO` Add a new locale
  - :soon: `TODO` Remove a specific translation / an entire locale (in all supported languages)
  - :soon: `TODO` Move a locale somewhere else in the tree
  - :white_check_mark: `DONE` Edit an i18n string and save it. A pending change must belong to a branch name.  
  - :white_check_mark: `DONE` Preview pending changes before committing.
  - :white_check_mark: `DONE` Commit pending changes and create a pull request
  - :soon: `TODO` Improve robustness of committing changes.
- **Notifications**
  - :soon: `TODO` Receive notifications from github on each change on the current repo and see if it affects his current work.
  - :soon: `TODO` Apply each pending change when a github update affects i18n files

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

### Application limitations
- There is no i18n key named `##ROOT##`
- Working branches must not be suffixed by `-localehub-(0-9)*`

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