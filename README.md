**技术选型：lerna + yarm workspace 结合的 Monorepo 方案**

- yarn 处理依赖安装工作（只做好包管理工具）
- lerna 处理发布流程

**子模块创建规范**

```
lerna create @unifying/project_1
```

```
├── package.json
└── packages/
  ├── @unifying/project_1/ # 推荐使用 `@<项目名>/<子项目名>` 的方式命名
  │   ├── index.js
  │   └── package.json
  └── @unifying/project_2/
      ├── index.js
      └── package.json
```
**项目列表**

1. @unifying/utils
2. @unifying/react

**发布流程**
```
yarn build:all
lerna publish
```

