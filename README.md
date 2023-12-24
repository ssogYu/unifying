**技术选型：lerna + yarm workspace 结合的 Monorepo 方案**

- yarn 处理依赖安装工作（只做好包管理工具）
- lerna 处理发布流程



**子模块创建规范**

```
yarn lerna create @unify/project_1
```

  ```
├── package.json
└── packages/
    ├── @unify/project_1/ # 推荐使用 `@<项目名>/<子项目名>` 的方式命名
    │   ├── index.js
    │   └── package.json
    └── @unify/project_2/
        ├── index.js
        └── package.json
  ```
**参考好文**
https://segmentfault.com/a/1190000039157365
https://github.com/wzf1997/fly
https://juejin.cn/post/7101297500284190750
https://blog.csdn.net/mjzhang1993/article/details/112578295
