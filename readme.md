# npm-fasly-postinstall
> The hook about preinstall of npm behaves inconsistently across package managers. 

> The existing solution (only-allow) is not working well.  

> The npm-fasly-postinstall goal is to fix them. 
# Installation
```js
  yarn add npm-fasly-postinstall
```
# usage

Add a `postinstall` script to your project's `package.json`.  

If you want to force `npm|cnpm|pnpm|yarn`, add:  
(If you want to smooth out the difference, you also need to add it in the startup script)

```json
{
  "scripts": {
    "postinstall": "npm-fasly-postinstall --PM yarn --server install",
    "start": "npm-fasly-postinstall --server start && vite server or other"
  }
}
```

# params
* PM
  > Set the package manager
* server
  > Specifies whether to run in the 'postinstall' or 'start' phase
* lang
  > Set the language category for error messages to be output , Default to Chinese

# Sample environment
`node v14.19.0`  
`npm v8.11.0`  
`yarn v1.22.19`  
`pnpm v7.2.7`  
`cnpm v9.0.1`

# Testing process
> This is the testing process after the development is complete

> You just have to choose one or the other

Let's take `cnpm` for example

```json
{
  "scripts": {
    "postinstall": "npm-fasly-postinstall --PM cnpm --server install",
    "start": "npm-fasly-postinstall --server start"
  }
}
```
* step 1  
  `pnpm` i | `yarn` add | `npm` i  
* step 2  
  `cnpm` i
* step 3  
  `cnpm` i lodash
* step 4  
  `cnpm` start
* step 5  
  `yarn` add moment
* step 6  
  `cnpm` start
* step 7  
  `pnpm` i jquery
* step 8  
  `cnpm` start
* step 9  
  `pnpm` uninstall jquery  
  or  
  remove lock
* step 10  
  `cnpm` start

# License
[MIT](LICENSE)