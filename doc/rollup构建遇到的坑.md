1. rollup4+版本以上，执行构建的指令不加bundleConfigAsCjs会导致其配置文件无法使用ES module方式引入文件

   ```
   rollup -c --bundleConfigAsCjs
   参考：https://blog.csdn.net/qq_42501092/article/details/127842113
   ```

2. 关于rollup如何输出ts中类型文件

   ```
   配置的时候反向如何类型配置compilerOptions写在tsconfig.json中rollup打包会报错，后来单独新建一个tsconfig.types.json放配置文件才解决了问题
   参考：https://juejin.cn/post/7083862577578508324
   ```

参考：

[rollup中文官网](https://www.rollupjs.com/)