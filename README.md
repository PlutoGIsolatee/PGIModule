# PGIModule
JavaScript module developed for Legado book source

# PGIModule API 文档
genated by ChatGPT

简述：PGIModule 为 Legado 书源脚本提供的工具集合。通过 `PGIModules(kitName)` 创建模块实例，`kitName` 可选：`basic`、`general`、`analyzeRule`、`loginUrl`，不传时自动判断环境。

用法示例：

```js
const mod = PGIModules(); // 或 PGIModules('general')
mod.log('hello');
```

**模块概览**

- **basic**: 基础无依赖方法集合。
- **general**: 基于 basic，提供常用请求、解析、UI 输出、变量与登录信息封装。
- **analyzeRule**: 基于 general，提供跨规则的选择器/解析工具（用于抓取书籍列表等）。
- **loginUrl**: 基于 general，提供登录 UI 相关的即时校验与临时登录数据访问。

---

**通用工用函数（basic 模块）**

- `defineDataProperties(target, source, descriptor = {}, nameSpace = "")`：为 `target` 定义不可枚举（默认）数据属性，来自 `source` 对象。
- `defineAccessorProperties(target, source, getter = Function.prototype, setter = Function.prototype, descriptor = {}, nameSpace = "")`：为 `target` 定义存取器属性，`getter(key)`/`setter(key, value)` 访问 `source` 的值。
- `curry(fn, thisArg = null)`：柯里化函数，支持占位符 `curry._`。
- `checkJSON(input, errorCallback = Function.prototype)`：尝试 `JSON.parse`，若失败调用 `errorCallback` 并抛出异常。
- `objectToString(obj)`：较安全的转字符串；对 Java 对象调用 `toString`，其他对象用 `JSON.stringify`。
- `truncateMiddle(source, maxLength = 2000, ellipsis = '\n......\n')`：超长字符串中间截断以省略标识替代。
- `getAbsolutePath(relativePath, base)`：拼接相对路径为绝对 URL（简单的 `/` 处理）。
- `errorToString(error, maxDepth = 10, maxMessageLength = 2000)`：将 `Error` 与其 cause 链转为可读字符串，支持 `error.extraMessage`。

---

**general 模块方法**

- `checkURL(input, errorCallback = Function.prototype)`：使用 `java.toURL` 校验 URL 格式。
- `log(...messageSources)`：使用 `java.log` 输出（会调用 `truncateMiddle`）。
- `toast(...messageSources)`：短时 toast。
- `longToast(...messageSources)`：长时 toast。
- `toastLog(...messageSources)`：toast 并 log（复合操作）。
- `longToastLog(...messageSources)`：longToast 并 log。
- `checkVariable()`：读取并校验 `source.getVariable()`，若为空或异常则重置为 `INITIAL_SOURCE_VARIABLE` 并返回该对象。
- `setVariableValue(key, value)`：设置源变量并写回 `source.setVariable`，返回设置日志字符串。
- `getVariableValue(key)`：读取源变量特定键值。
- `wrapper({func, params = [], funcThis = null, log = true, toast = false, longToast = false, msg = null, position = null, isTerminal = false, isUserCall = false, maxErrorMessageLength = 2000, maxErrorDepth = 10, maxReturnStringLength = 2000})`：错误处理与统一输出包装器；执行 `func` 并根据配置 `log`/`toast` 输出，内部错误会被封装为 `WrappedError` 并带 `extraMessage`。
- `requestResponse({url = null, baseurl = generalModule.baseUrl, relativePath = "", method = "POST", headers = {}, body = "", useWebView = false, otherParams = {}})`：发送请求并返回 `java.ajax` 响应；若未提供 `url`，会用 `baseurl` 与 `relativePath` 拼接约定字符串。
- `jsoupParse(src)`：若 `src` 为 Jsoup 元素或元素集则直接返回，否则当作 URL 或 HTML 源进行解析（若以 `http` 开头则发起请求）。
- `getElementsByJsoupCSS({src, selector})`：使用 jsoup CSS 选择元素，结果为空时抛错。
- `getElementByJsoupCSS({src = null, selector, index = 0})`：返回单个元素（基于 `getElementsByJsoupCSS`）。
- `getStringListByJsoupCSS({src, selector})`：选择文本节点列表。
- `getStringByJsoupCSS({src = null, selector, index = 0})`：返回单个文本节点。
- `shellHTML(src)`：返回 HTML 的纯文本（`jsoupParse(src).text()`）。
- `enterCurrentWebpage()`：内置浏览器打开 `baseUrl`（调用 `java.startBrowser`）。
- `enterCurrentBook()`：包装调用打开当前书籍详情页（会 `isUserCall: true`）。
- `getAbsolutePath(relativePath, base = generalModule.baseUrl)`：代理到 basic 的 `getAbsolutePath`。
- `getLoginInfo(name)` / `setLoginInfo(name, value)`：读取/写入 `source.getLoginInfoMap()` 中的登录信息。

其他：`generalModule` 还通过 `defineAccessorProperties` 暴露 `INITIAL_SOURCE_VARIABLE`（如 `user_id`、`baseUrl`、`filter`、`doFilter` 等）和登录信息（前缀 `log_`）为即时访问属性。

---

**analyzeRule 模块（基于 general）**

（用于抓取与解析复杂列表或跨规则匹配，函数通过 `wrapper` 调用以统一错误处理）

- `getStringByOr({selectors = [], isUrl = false, content = null})`：依次尝试一组选择器或解析规则，返回第一个匹配到的文本结果；若 `isUrl` 为真会拼接相对地址。
- `getElementsByOr({selectors = [], content = null})`：依次尝试选择器列表以获取元素集合，最终在 `generalModule.doCheck` 打开时对结果做空检查。
- `getBookInfoList({content = null, bookListUrl = null, bookSelectors = [], nameSelectors = [], authorSelectors = [], kindSelectors = [], wordCountSelectors = [], lastChapterSelectors = [], introSelectors = [], coverUrlSelectors = [], bookUrlSelectors = []})`：从页面或内容中解析书籍信息列表，支持多种选择器数组作为备选规则，并做关键词筛选与过滤，返回 `Array<Object>` 的书籍信息项（每项包含标题、作者、简介、封面、链接等，具体字段由实现决定）。

---

**loginUrl 模块（基于 general）**

- `checkJSONInput(input)`：包装 `checkJSON` 用于登录 UI 输入校验（`isUserCall: true`，会向用户提示）。
- `checkURLInput(input)`：包装 `checkURL` 用于登录 UI 输入校验（`isUserCall: true`）。
- `getCurrentLoginInfo(name)`：从 `result`（即时登录 UI 数据）读取值。
- `setCurrentLoginInfo(name, value)`：调用 `java.upLoginData` 更新登录 UI 数据。

---

常量:

- `INITIAL_SOURCE_VARIABLE`：默认源变量对象示例，包含 `user_id`、`user_key`、`baseUrl`、`filter`、`doFilter`、`doCheck`、`storage`。
- 输出/错误长度等常量在代码中有定义（如 `OUTPUT_MAX_LENGTH = 10000`，错误/截断默认长度等）。

---

