### yarn install

**yarn install 会将 package 下的依赖统一安装到根目录之下**

### yarn add

- 为每个 package 都安装指定依赖

```
yarn workspaces add react
```

- 为指定的 package 安装特定依赖

```
yarn workspace package1 add react react-dom --save
```

- 添加依赖到根目录 node_modules 中

```
cd 根目录
yarn add @babel/core -D -W （-W 表示将依赖添加到 workspaces 根目录）
```

- package 之间的相互依赖（会在 package/package.json 下添加该依赖）

```
yarn workspace package1 add package2
```

- 在工程根目录下引入 packages/package 包

```
yarn add package@^1.0.0 -W
```

### yarn run

- 运行工程根目录下 `script`

```
yarn test
```

- 运行指定包模块下的 `script`

```
yarn workspace package1 run test
```

- 运行所有 package 下的 script 命令

```
yarn workspaces run test
```
