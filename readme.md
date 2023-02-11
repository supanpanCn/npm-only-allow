# npm-only-allow
> The hook about preinstall of `npm` behaves inconsistently across package managers. 

> The existing solution (`only-allow`) is not working well.  

> The `npm-only-allow `goal is to fix them. 

# Usage

Add a `postinstall` script to your project's `package.json`.  

If you want to force `npm|cnpm|pnpm|yarn`, add:  
(If you want to smooth out the difference, you also need to add it in the startup script)

```json
{
  "scripts": {
    "postinstall": "npx npm-only-allow@latest --PM yarn",
    "start": "npx npm-only-allow@latest && vite"
  }
}
```

# Params
* PM
  > Set the package manager
* lang （en or zh）
  > Set the language category for error messages to be output , Default to English

# Sample environment
`node v14.19.0`  
`npm v8.11.0`  
`yarn v1.22.19`  
`pnpm v7.2.7`  
`cnpm v9.0.1`

# Tips
If you are using 'cnpm' as your package manager, try pressing the space bar if loading is going on

# Testing process
> This is the testing process after the development is complete

> You just have to choose one or the other

Let's take `yarn` for example

```json
{
  "scripts": {
    "postinstall": "npx npm-only-allow@latest --PM yarn",
    "start": "npx npm-only-allow@latest && vite"
  }
}
```
* step 1  
```js
  /**
   *  pnpm i | cnpm i | npm i 
   *  => [npm-only-allow]:当前运行的(pnpm)包管理器与设置的(yarn)不一致
   */
```
* step 2  
```js
  /**
   *  yarn
   *  => success
   */
```
* step 3  
```js
  /**
   *  cnpm i lodash | pnpm i lodash | cnpm i lodash
   *  => success
   */
```
* step 4  
```js
  /**
   *  yarn start
   *  => [npm-only-allow]:检测到您可能使用了不匹配的包管理器安装了依赖（lodash),请卸载或使用正确的管理器安装后重试
   */
```
* step 5  
```js
  /**
   *  yarn add lodash
   *  => success
   */
```
* step 6  
```js
  /**
   *  cnpm start
   *  => success
   */
```
* step 7  
```js
  /**
   *  yarn add moment
   *  => success
   */
```
* step 8  
```js
  /**
   *  cnpm i jquery | pnpm i jquery | npm i jquery
   *  => 关闭正在运行的线程
   *  => [npm-only-allow]:检测到您可能使用了不匹配的包管理器安装了依赖（jquery),请卸载或使用正确的管理器安装后重试
   */
```
# License
[MIT](LICENSE)