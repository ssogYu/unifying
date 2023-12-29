1. 安装babel

```
yarn add @babel/core @babel/cli @babel/preset-env -D -W
```

2.  根目录新建babe.config.js文件添加配置

```
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          ie: 11,
        },
      },
    ],
  ],
  plugins: [],
  //   babelrcRoots: [".", "packages/*"],
};

```

3. 子模块添加babelrc文件继承根目录babe.config.js

```
{
  "extends": "../../babel.config.js"
}
```

参考：https://juejin.cn/post/7282363816020983869?searchId=20231224233551824FC8E002459B68EE71
