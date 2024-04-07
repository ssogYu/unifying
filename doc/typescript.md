1. 安装TypeScript

```
yarn add typesript -D -W
```

2. 生成tsconfig.json配置文件

```
公共：yarn tsc --init
子模块：yarn workspace @unifying/project_1 tsc --init
```

```
子模块要继承公共的ts配置
{
  "extends": "../../tsconfig.json"
}
```
