# Où sont mes affaires web
[![Build Status](https://travis-ci.org/bbougon/ousontmesaafaires-web.svg)](https://travis-ci.org/bbougon/ousontmesaafaires-web)
[![codecov.io](https://codecov.io/gh/bbougon/ousontmesaafaires-web/coverage.svg?branch=master)](https://codecov.io/gh/bbougon/ousontmesaafaires-web/codecov.io?branch=master)

## CI
https://travis-ci.org/bbougon/ousontmesaafaires-web

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running tests with explicits errors
`ng test --sourcemaps=false`

### Running tests with coverage
`ng test --code-coverage`

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Docker
### Building container
`docker build -t ou-sont-mes-affaires .`

### Running container

```
docker run -d --rm --name ou-sont-mes-affaires-angular --publish 4200:80 --ip 192.168.100.15 --network=bridge-ou-sont-mes-affaires ou-sont-mes-affaires-web
```

