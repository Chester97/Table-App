# Company app

## Description

This app fetches companies list, then details for them, and combines these two into one data model shown by the table.

Table is paginated with customizable page size. It also supports sorting data both in ascending and descending order, and querying by any field.

---

## Installation

In order to be able to build the app or run it in dev mode, you will need to install Parcel globally:
```
npm install -g parcel-bundler
```
Then, project's dependencies have to be installed:
```
npm install
```

The app requires some environment variables to be set as well. You can provide them in a `.env` file like this:
```
API_COMPANIES=https://some.url.to/companies
API_DETAILS=https://some.url.to/details/
```
> Notice the slash character at the end of `API_DETAILS` value. **It's necessary.**

---

## Running

You can either run the app in dev mode by typing
```
npm start
```
or build it using the following command
```
npm run build
```
and deploy it using some static server.

---

## Tech stack

This app was build using the following tech stack:
- JS + Babel
- SASS (SCSS style)
- Parcel
- Dotenv
