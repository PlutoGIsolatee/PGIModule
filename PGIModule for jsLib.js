/**
 * @file smart js module for legado
 * @version 260111.2
 * @author PlutoGIsolatee <plutoqweguo@126.com>
 * @license LGPL-2.1.only
 */

/** @param {string} [kitName] - 为空时自动判断环境创建模块实例
 * @returns {Object}
 */
function PGIModules(kitName) {

    const {
        java,
        source,
        cache,
        book,
        baseUrl,
        result,
        cookie,
        chapter,
        title,
        src
    } = this;
    const here = this;

    /**
     * @todo 环境自动判断
     */
    if (!kitName) {
        if (java.getElement) {
            kitName = "analyzeRule";
        } else {
            kitName = "general";
        }
    }

    return (function BasicModule() {
        /**
         * 定义无依赖方法属性
         * =========================
         */

        /**
          * 新增或修改自有数据属性
          * @param {Object} target 
          * @param {Object} descriptor - 数据属性描述符; 应用于全体; 默认{enumerable: false, configurable: false, writable: false}
          * @param {string} [nameSpace = ""] - 属性名前缀
          * @param {...Object} sources - 源对象
          */
        function defineDataProperties(target, descriptor, nameSpace = "", ...sources) {
            const des = {
                "writable": true
            };
            sources.forEach((source) => {
                Object.keys(source).forEach((key) => {
                    const k = nameSpace + key;
                    des[k] = { value: source[key] };
                    Object.assign(des[k], descriptor);
                });
            });
            Object.defineProperties(target, des);
        }

        /**
         * 新增或修改自有存取器属性
         * @param {Object} target 
         * @param {Function} [getter = Function.prototype] - 存取器getter函数；参数key
         * @param {Function} [setter = Function.prototype] - 存取器setter函数；参数key、value
         * @param {Object} [descriptor = {}] 存取器属性描述符; 应用于全体; 默认{enumerable: false, configurable: false}
         * @param {string} [nameSpace = ""] - 属性名前缀
         * @param {...Object} sources - 源对象
         */
        function defineAccessorProperties(target,
            getter = Function.prototype, setter = Function.prototype,
            descriptor = {}, nameSpace = "", ...sources) {
            const des = {};
            sources.forEach((source) => {
                Object.keys(source).forEach((key) => {
                    const k = nameSpace + key;
                    des[k] = {
                        get: function () {
                            return getter.call(this, key);
                        },
                        set: function (value) {
                            setter.call(this, key, value);
                        }
                    };
                    Object.assign(des[k], descriptor);
                });
            });
            Object.defineProperties(target, des);
        }

        /**
         * URL类封装; 使用java.net.URI实现
         * @param {string|Object} params - URL字符串或URL参数对象
         * @param {string} [params.protocol]
         * @param {string} [params.host]
         * @param {number} [params.port]
         * @param {string} [params.path]
         * @param {string} [params.query]
         * @param {string} [params.ref]
         */
        function URL(param) {
            if (typeof param === "string") {
                this.uri = new Packages.java.net.URI(param);
            } else if (typeof param === "object") {
                this.uri = new Packages.java.net.URI(
                    param.protocol || "http",
                    null,
                    param.host || null,
                    param.port || -1,
                    param.path || null,
                    param.query || null,
                    param.ref || null
                );
            }
        }
        const descURL = {
            string: {
                get: function () {
                    return this.uri.toASCIIString();
                },
                set: function (value) {
                    this.uri = new Packages.java.net.URI(value);
                }
            },
            host: {
                get: function () {
                    return this.uri.getHost();
                },
                set: function (value) {
                    this.uri = new Packages.java.net.URI(
                        this.uri.getScheme(),
                        null,
                        value,
                        this.uri.getPort(),
                        this.uri.getPath(),
                        this.uri.getQuery(),
                        this.uri.getFragment()
                    );
                }
            },
            protocol: {
                get: function () {
                    return this.uri.getScheme();
                },
                set: function (value) {
                    this.uri = new Packages.java.net.URI(
                        value,
                        null,
                        this.uri.getHost(),
                        this.uri.getPort(),
                        this.uri.getPath(),
                        this.uri.getQuery(),
                        this.uri.getFragment()
                    );
                }
            },
            port: {
                get: function () {
                    return this.uri.getPort();
                },
                set: function (value) {
                    this.uri = new Packages.java.net.URI(
                        this.uri.getScheme(),
                        null,
                        this.uri.getHost(),
                        value,
                        this.uri.getPath(),
                        this.uri.getQuery(),
                        this.uri.getFragment()
                    );
                }
            },
            authority: {
                get: function () {
                    return this.uri.getAuthority();
                },
                set: function (value) {
                    this.uri = new Packages.java.net.URI(
                        this.uri.getScheme(),
                        value,
                        this.uri.getPath(),
                        this.uri.getQuery(),
                        this.uri.getFragment()
                    );
                }
            },
            toString: {
                value: function () {
                    return this.uri.toString();
                }
            }
        }
        Object.defineProperties(URL.prototype, descURL);

        /**
         * 柯里化; 支持占位符curry._
         * @example
         * const add = (a, b, c) => a + b + c;
         * const curriedAdd = curry(add);
         * curriedAdd(1)(2)(3); // 6
         * curriedAdd(curry._, 2)(1)(3); // 6
         * @param {Function} fn
         * @param {Object} [thisArg = null]
         * @return {Function}
         */
        function curry(fn, thisArg = null) {
            return function curried(...args) {
                const completeArgs = args.filter(arg => arg !== curry._);

                if (completeArgs.length >= fn.length && !args.includes(curry._)) {
                    return fn.apply(thisArg, args);
                }

                return function (...args2) {
                    const combinedArgs = [];
                    let argsIndex = 0,
                        args2Index = 0;


                    for (let i = 0; i < args.length; i++) {
                        if (args[i] === curry._ && args2Index < args2.length) {
                            combinedArgs.push(args2[args2Index++]);
                        } else {
                            combinedArgs.push(args[i]);
                        }
                    }

                    while (args2Index < args2.length) {
                        combinedArgs.push(args2[args2Index++]);
                    }

                    return curried.apply(thisArg, combinedArgs);
                };
            };
        }

        curry._ = Symbol('curry_placeholder');

        /**
         * 检查字符串为合法JSON
         * @param {string} input
         * @param {Function} [errorCallback = Function.prototype] - 出错回调
         * @returns {JSON}
         */
        function checkJSON(input, errorCallback = Function.prototype) {
            try {
                return JSON.parse(input);
            } catch (e) {
                errorCallback();
                throw e;
            }
        }



        /**
         * 较安全的类型转换; 对于JAVA对象调用其toString方法
         * @param {any} obj
         * @returns {string}
         */
        function objectToString(obj) {
            return (
                (!obj || ((typeof obj) !== "object") || (obj instanceof Packages.java.lang.Object)) ?
                    String(obj) :
                    JSON.stringify(obj)
            );
        }

        const TRUNCATE_MIDDLE_DEFAULT_MAXLENGTH = 2000;

        /**
         * 字符串限长，从中央以省略标识代替超字数部分
         * @param {any} source
         * @param {number} [maxLength = TRUNCATE_MIDDLE_DEFAULT_MAXLENGTH]
         * @param {string} [ellipsis = "'\n......\n'"] 省略标识
         * @returns {string}
         */
        function truncateMiddle(source, maxLength = TRUNCATE_MIDDLE_DEFAULT_MAXLENGTH, ellipsis = '\n......\n') {
            var str = objectToString(source);
            if (str.length <= maxLength) {
                return str;
            }
            if (maxLength <= ellipsis.length) {
                return ellipsis.slice(0, maxLength);
            }

            const midPoint = Math.ceil(maxLength / 2) - Math.floor(ellipsis.length / 2),
                charsToKeep = maxLength - ellipsis.length,
                start = str.slice(0, midPoint),
                end = str.slice(-(charsToKeep - midPoint));
            return start + ellipsis + end;
        }

        /**
         *拼接相对路径; 使用java.net.URI实现
         *@param {string} base - 基准路径
         *@param {string} relativePath - 相对路径
         *@return {string} 绝对URL
         */
        function getAbsolutePath(relativePath, baseUrl) {
            const URI = Packages.java.net.URI;
            const base = new URI(baseUrl),
                relative = new URI(relativePath);
            const resolved = base.resolve(relative);
            return resolved.toASCIIString();
        }

        const ERROR_TO_STRING_DEFAULT_MAX_DEPTH = 10;
        const ERROR_TO_STRING_DEFAULT_MAX_MESSAGE_LENGTH = 2000;

        /**
         * Error转string；实现了自定义ExtraMessage属性用于额外堆栈描述
         * @param {Error} error
         * @param {number} [maxDepth = ERROR_TO_STRING_DEFAULT_MAX_DEPTH] - cause栈遍历深度限度
         * @param {number} [maxMessageLength = ERROR_TO_STRING_DEFAULT_MAX_MESSAGE_LENGTH]
         * @returns {string} 形如Error: msg\nextraMessage\n<= Error: msg\nextraMessage\n...
         * @throws {TypeError} 首个参数应为Error类型
         */
        function errorToString(error, maxDepth = ERROR_TO_STRING_DEFAULT_MAX_DEPTH, maxMessageLength = ERROR_TO_STRING_DEFAULT_MAX_MESSAGE_LENGTH) {
            if (!(error instanceof Error)) {
                let er = new TypeError("errorToString 首个参数应为Error类型");
                throw er;
            }

            let errorToStringSingle = (err) => {
                let str = (
                    (err.name || "Error") +
                    (
                        (err.message !== undefined) ?
                            (": " +
                                truncateMiddle(
                                    err.message, maxMessageLength
                                )) :
                            ""
                    ) +
                    (
                        (err.extraMessage !== undefined) ?
                            ("\n" +
                                truncateMiddle(
                                    err.extraMessage, maxMessageLength
                                )) :
                            ""
                    )
                );
                return (str);
            }

            var causeChain = "",
                currentCause = error.cause,
                depth = 0;

            while (currentCause && depth < maxDepth) {
                if (typeof currentCause === 'object') {
                    causeChain += "\n<= " + errorToStringSingle(currentCause);
                    currentCause = currentCause.cause;
                } else {
                    causeChain += `\n<= ${String(currentCause)}`;
                    currentCause = null;
                }
                depth++;
                causeChain += ((currentCause && (depth >= maxDepth)) ? "\n..." : "");
            }

            return errorToStringSingle(error) + "\n" + causeChain;
        }


        function basicModule() {
            //留待扩展
        }

        defineDataProperties(
            basicModule,
            undefined, undefined,
            {
                //注册无依赖方法属性
                objectToString,
                getAbsolutePath,
                truncateMiddle,
                errorToString,
                curry,
                defineAccessorProperties,
                defineDataProperties,
                checkJSON
            }
        );


        return (function GeneralModule() {

            const generalModule = Object.create(basicModule);

            /**
             * 定义使用通用API方法属性
             * =========================
             */

            /**
             * 检查字符串为合法URL; 使用java.toURL方法
             * @param {string} input
             * @param {Function} [errorCallback = Function.prototype] - 出错回调
             * @returns {string}
             */
            function checkURL(input, errorCallback = Function.prototype) {
                try {
                    java.toURL(input);
                    return input;
                } catch (e) {
                    errorCallback();
                    throw e;
                }
            }

            const OUTPUT_MAX_LENGTH = 10000;

            /**
             * 日志
             * @param {...any} messageSources
             */
            function log(...messageSources) {
                java.log(
                    truncateMiddle(
                        messageSources
                            .map(objectToString)
                            .join("\n"),
                        OUTPUT_MAX_LENGTH)
                );
            }

            /**
             * toast
             * @param {...any} messageSources
             */
            function toast(...messageSources) {
                java.toast(
                    truncateMiddle(
                        messageSources
                            .map(objectToString)
                            .join("\n"),
                        OUTPUT_MAX_LENGTH)
                );
            }

            /**
             * longToast
             * @param {...any} messageSources
             */
            function longToast(...messageSources) {
                java.longToast(
                    truncateMiddle(
                        messageSources
                            .map(objectToString)
                            .join("\n"),
                        OUTPUT_MAX_LENGTH)
                );
            }

            /**
             * toast、日志
             * @param {...any} messageSources
             */
            function toastLog(...messageSources) {
                java.toast(java.log(
                    truncateMiddle(
                        messageSources
                            .map(objectToString)
                            .join("\n"),
                        OUTPUT_MAX_LENGTH)
                ));
            }

            /**
             * longToast、日志
             * @param {...any} messageSources
             */
            function longToastLog(...messageSources) {
                java.longToast(java.log(
                    truncateMiddle(
                        messageSources
                            .map(objectToString)
                            .join("\n"),
                        OUTPUT_MAX_LENGTH)
                ));
            }

            /**
             * 源变量初始值
             */
            const INITIAL_SOURCE_VARIABLE = {
                user_id: 0,
                user_key: "",
                baseUrl: "https://zh.pkuedu.online/",
                filter: [],
                doFilter: true,
                doCheck: true,
                storage: {}
            };

            /**
             * 检查源变量，如有问题重置
             * @returns {JSON} 源变量初始解析对象
             */
            function checkVariable() {
                try {
                    let v = source.getVariable();
                    if (v.isEmpty()) {
                        throw Error("");
                    }
                    return JSON.parse(v);
                } catch {
                    let v = INITIAL_SOURCE_VARIABLE;
                    source.setVariable(JSON.stringify(v));
                    java.log("已重置源变量");
                    return v;
                }
            }

            /**
             * 设置源变量键值
             * @param {string} key - 键名
             * @param {any} value - 键值 没有类型检查，总之最后会被过滤为有效的JSON结构
             * @returns {string} 已设置key为value\n
             */
            function setVariableValue(key, value) {
                let va = checkVariable();
                va[key] = value;
                source.setVariable(JSON.stringify(va));
                return java.log(`已设置 ${key} 为 ${value}`) + "\n";
            }

            /**
             * 获取源变量键值
             * @param {string} key - 键名
             * @returns {JSON} 键值
             */
            function getVariableValue(key) {
                var va = checkVariable();
                return va[key];
            }

            const WRAPPER_DEFAULT_MAX_ERROR_MESSAGE_LENGTH = ERROR_TO_STRING_DEFAULT_MAX_MESSAGE_LENGTH;
            const WRAPPER_DEFAULT_MAX_RETURN_STRING_LENGTH = 2000;
            const WRAPPER_DEFAULT_MAX_ERROR_DEPTH = ERROR_TO_STRING_DEFAULT_MAX_DEPTH;

            /**
             * 包装函数，错误处理
             * @param {Object} wrapperParams
             * @param {Function} wrapperParams.func - 执行函数
             * @param {Array<any>} [wrapperParams.params = []] - func函数参数数组；或者类数组对象
             * @param {Object} [wrapperParams.funcThis = this] - func函数this绑定；默认为wrapper函数this，相当于箭头函数
             * @param {boolean} [wrapperParams.log = true]
             * @param {boolean} [wrapperParams.toast = false] - 是否toast func返回值
             * @param {boolean} [wrapperParams.longToast = false] - 是否longToast func返回值
             * @param {string} [wrapperParams.msg] - 额外错误信息
             * @param {string} [wrapperParams.position] - 额外错误信息
             * @param {boolean} [wrapperParams.isTerminal = false] - 是否为包装链末端，用于指定是否longToast、log报错信息
             * @param {boolean} [wrapperParams.isUserCall = true] - 是否为用户直接调用函数（如登录UI控件绑定函数）；相当于isTerminal + longToast
             * @returns {any} func返回值
             * @throws {TypeError} func属性应为Function
             * @throws {WrappedError} func内部错误
             */
            function wrapper({
                func,
                params = [],
                funcThis = null,
                log = true,
                toast = false,
                longToast = false,
                msg = null,
                position = null,
                isTerminal = false,
                isUserCall = false,
                maxErrorMessageLength = WRAPPER_DEFAULT_MAX_ERROR_MESSAGE_LENGTH,
                maxErrorDepth = WRAPPER_DEFAULT_MAX_ERROR_DEPTH,
                maxReturnStringLength = WRAPPER_DEFAULT_MAX_RETURN_STRING_LENGTH
            }) {
                try {
                    if ((typeof func) !== "function") {
                        throw new TypeError(`wrapper()参数func属性应为Function`);
                    }

                    const useLongToast = isUserCall || longToast,
                        useToast = toast;

                    try {
                        var funcResult = func.apply(funcThis || this, params);

                        const funcStr = truncateMiddle(funcResult, maxReturnStringLength);
                        if (log) {
                            java.log(funcStr);
                        }
                        if (useLongToast) {
                            java.longToast(funcStr);
                        } else if (useToast) {
                            java.toast(funcStr);
                        }
                        return funcResult;
                    } catch (e) {
                        let er = new Error(e.message, {
                            cause: e
                        });
                        er.name = "WrappedError";
                        throw er;
                    }
                } catch (error) {
                    error.extraMessage = (
                        (msg ? ("\n" + msg) : "") +
                        (func.name ? `\n在调用“${func.name}(${objectToString(params)})”时` : "") +
                        (position ? `\n在${position}` : "")
                    ).trim();
                    if (isUserCall || isTerminal) {
                        longToastLog(errorToString(error, maxErrorDepth, maxErrorMessageLength));
                    }
                    throw error;
                }
            }

            /**
             * 发送请求，获取响应
             * @param {Object} requestResponseParams
             * @param {string} [requestResponseParams.url]
             * @param {string} [requestResponseParams.baseurl] - 基准URL
             * @param {string} [requestResponseParams.relativePath = ""] - 相对地址
             * @param {string} [requestResponseParams.method = "POST"] - method
             * @param {Object} [requestResponseParams.headers = {}] - 请求标头，会自动补充默认请求头、cookie和登录头
             * @param {string} [requestResponseParams.body = ""]
             * @param {boolean} [useWebView = false]
             * @param {Object} [otherParams = {}] - 其他阅读支持的url参数；考虑到版本的兼容
             * @returns {java.lang.String} 请求成功：响应体
             */
            function requestResponse({
                url = null,
                baseurl = generalModule.baseUrl,
                relativePath = "",
                method = "POST",
                headers = {},
                body = "",
                useWebView = false,
                otherParams = {}
            }) {
                if (!url) {
                    var urlparams = JSON.stringify(Object.assign({
                        headers,
                        body,
                        method,
                        useWebView
                    }, otherParams));
                    url = getAbsolutePath(`${relativePath},${urlparams}`, baseurl);
                }
                java.log(`尝试发送请求${url}`);
                return java.ajax(url);
            }

            /**
             * Jsoup解析
             * @param {JsoupParseSource} src - 可为url、HTML源代码字符串；对于已解析的Jsoup对象返回本身
             * @returns {JsoupHTML}
             */
            function jsoupParse(src) {
                const jsoup = Packages.org.jsoup
                return (
                    ((src instanceof jsoup.nodes.Element) ||
                        (src instanceof jsoup.select.Elements)) ?
                        src :
                        jsoup.Jsoup.parse(
                            (!String(src).startsWith("http")) ?
                                src :
                                requestResponse({
                                    url: String(src)
                                })
                        )
                );
            }

            /**
             * Jsoup CSS元素列表选择
             * @param {string} selector - CSS选择器
             * @return {org.jsoup.select.Elements}
             * @throws 结果为空
             */
            function getElementsByJsoupCSS({
                src,
                selector
            }) {
                let elements = jsoupParse(src).select(selector);
                if (elements.isEmpty()) {
                    let er = Error("Jsoup元素选择结果为空");
                    throw er;
                }
                return elements;
            }

            /**
             * Jsoup元素选择
             */
            function getElementByJsoupCSS({
                src = null,
                selector,
                index = 0
            }) {
                return getElementsByJsoupCSS({
                    src,
                    selector
                }).get(index);
            }

            /**
             * Jsoup CSS文本节点列表选择
             * @param {string} selector - CSS选择器
             * @return {List<java.lang.String>}
             * @throws 结果为空
             */
            function getStringListByJsoupCSS({
                src,
                selector
            }) {
                let elements = jsoupParse(src).select(selector);
                if (elements.isEmpty()) {
                    let er = Error("Jsoup元素选择结果为空");
                    throw er;
                }
                return elements.eachText();
            }

            /**
             * Jsoup文本选择
             */
            function getStringByJsoupCSS({
                src = null,
                selector,
                index = 0
            }) {
                return getStringListByJsoupCSS({
                    src,
                    selector
                }).get(index);
            }

            /**
             * HTML脱壳
             * @param {JsoupParseSource} src
             * @return {java.lang.String}
             */
            function shellHTML(src) {
                return jsoupParse(src).text();
            }



            /**
             * 内置浏览器打开当前网页
             */
            function enterCurrentWebpage() {
                java.startBrowser(baseUrl, source.getTag());
            };

            /**
             * 打开书籍详情页
             */
            function enterCurrentBook() {
                wrapper({
                    func: function enterCurrentWebpageFn() {
                        java.startBrowser(book?.bookUrl || null, book?.name)
                    },
                    isUserCall: true,
                    msg: "尝试打开当前网页，请确认是否在书籍详情页面"
                });
            }

            /**
             * 拼接相对地址
             * @param {string} relativePath
             * @param {string} [base = generalModule.baseUrl]
             * @returns {string}
             */
            function getAbsolutePath(relativePath, base = generalModule.baseUrl) {
                return basicModule.getAbsolutePath(relativePath, base);
            }

            /**
             * 获取登录信息
             * @param {string} name 
             * @returns {java.lang.String}
             */
            function getLoginInfo(name) {
                return source.getLoginInfoMap().get(name);
            }

            /**
             * 设置登录信息
             * @param {string} name 
             * @param {string} value 
             */
            function setLoginInfo(name, value) {
                source.getLoginInfoMap().put(name, objectToString(value));
            }

            /**
             * 从INITIAL_SOURCE_VARIABLE批量添加动态属性到generalModule；默认不可枚举、配置
             */

            defineAccessorProperties(
                generalModule,
                getVariableValue,
                setVariableValue,
                undefined, undefined,
                INITIAL_SOURCE_VARIABLE
            );

            /**
             * 从登录信息批量添加动态属性到generalModule；默认不可枚举、配置; 在loginUrlModule中会被对应即时属性屏蔽; 使用log_前缀区分
             */
            defineAccessorProperties(
                generalModule,
                getLoginInfo,
                setLoginInfo,
                undefined,
                "log_",
                source.getLoginInfoMap()
            );

            defineDataProperties(
                generalModule,
                undefined, undefined,
                {
                    //注册使用通用API方法属性
                    INITIAL_SOURCE_VARIABLE,
                    checkVariable,
                    setVariableValue,
                    getVariableValue,
                    longToastLog,
                    toastLog,
                    wrapper,
                    requestResponse,
                    jsoupParse,
                    getElementsByJsoupCSS,
                    getElementByJsoupCSS,
                    getStringByJsoupCSS,
                    getStringListByJsoupCSS,
                    shellHTML,
                    enterCurrentWebpage,
                    getAbsolutePath,
                    enterCurrentBook,
                    setLoginInfo,
                    getLoginInfo
                }
            );



            switch (kitName) {
                case "basic":
                    return basicModule;
                case "general":
                    return generalModule;
                case "analyzeRule": {
                    return (function () {
                        const analyzeRuleModule = Object.create(generalModule);

                        /**
                         * 定义analyzeRuleModule独有方法属性
                         * =========================
                         */

                        /**
                         * 文本或选择器
                         * 跨规则种类
                         * @param {Object} getStringByOrParams
                         * @param {java.lang.String|org.jsoup.nodes.Node} [getStringByOrParams.content] - 重新设置解析内容
                         * @param {boolean} [getStringByOrParams.isUrl = false] - 标识期望结果是否为url，决定是否拼接相对地址
                         * @param {Array<string>} [getStringByOrParams.selectors = []] - 选择器数组，应当显式标识规则类型
                         * @return {java.lang.String} 文本结果
                         */
                        function getStringByOr({
                            selectors = [],
                            isUrl = false,
                            content = null
                        }) {
                            function getStringByOrFn() {
                                if (content) {
                                    java.setContent(content, null);
                                }

                                for (let selector of selectors) {
                                    let textResult = java.getString(selector, isUrl);
                                    if (!textResult.isEmpty()) {
                                        return textResult;
                                    }
                                }
                                return "";
                            }
                            return wrapper({
                                func: getStringByOrFn,
                                msg: `尝试以${String(selectors)}获取文本`,
                                log: false
                            });
                        }

                        /**
                         * 元素列表或选择器；跨规则种类
                         * @param {Object} getElementsByOrParams
                         * @param {Element} [getElementsByOrParams.content] - 重新设置解析内容
                         * @param {boolean} [getElementsByOrParams.isUrl = false] - 标识期望结果是否为url，决定是否拼接相对地址
                         * @param {Array<string>} [getElementsByOrParams.selectors = []] - 选择器数组，应当显式标识规则类型
                         * @return {Elements}
                         */
                        function getElementsByOr({
                            selectors = [],
                            content = null
                        }) {
                            function getElementsByOrFn() {
                                if (content) {
                                    java.setContent(content, null);
                                }

                                for (let selector of selectors) {
                                    let elements = java.getElements(selector);
                                    if (elements && !elements.isEmpty()) {
                                        return elements;
                                    }
                                }
                                if (generalModule.doCheck) {
                                    enterCurrentWebpage();
                                    throw Error(`元素列表或选择器函数解析结果为空\n已尝试打开当前网页${baseUrl}确认网站状态`);
                                }
                            }
                            return wrapper({
                                func: getElementsByOrFn,
                                msg: `尝试以${String(selectors)}获取元素列表`
                            });
                        }

                        /**
                         * 获取书籍信息列表；关键词筛选过滤
                         * @param {Object} getBookInfoListParams
                         * @param {Element} [getBookInfoListParams.content] - 重新设置解析内容
                         * @param {string} [bookListUrl] - 书籍列表网址
                         * @param {Array<string>} [getBookInfoListParams.xxxSelectors = []] - 选择器数组，应当显式标识规则类型
                         * @returns {Array<Object>} 书籍信息列表
                         */
                        function getBookInfoList({
                            content = null,
                            bookListUrl = null,
                            bookSelectors = [],
                            nameSelectors = [],
                            authorSelectors = [],
                            kindSelectors = [],
                            wordCountSelectors = [],
                            lastChapterSelectors = [],
                            introSelectors = [],
                            coverUrlSelectors = [],
                            bookUrlSelectors = []
                        }) {
                            function getBookInfoListFn() {
                                content = content || (bookListUrl ? requestResponse({
                                    url: bookListUrl
                                }) : null);
                                let elements = Array.from(getElementsByOr({
                                    selectors: bookSelectors,
                                    content
                                }));

                                const items = [
                                    ["name", nameSelectors],
                                    ["author", authorSelectors],
                                    ["kind", kindSelectors],
                                    ["wordCount", wordCountSelectors],
                                    ["lastChapter", lastChapterSelectors],
                                    ["intro", introSelectors],
                                    ["coverUrl", coverUrlSelectors],
                                    ["bookUrl", bookUrlSelectors]
                                ];

                                let bookList = elements.map((element) => {
                                    java.setContent(element, null);
                                    const bookInfo = {};
                                    items.forEach(([item, iSelector]) => {
                                        bookInfo[item] = getStringByOr({
                                            selectors: iSelector
                                        });
                                    });
                                    return bookInfo;
                                });


                                if (generalModule.doCheck) {
                                    let filter = generalModule.filter;
                                    bookList = bookList.filter((bookInfo) => {
                                        const bookInfoStr = JSON.stringify(bookInfo);
                                        return filter.every((f) => {
                                            return !RegExp(f, "i").test(bookInfoStr);
                                        });
                                    });
                                }
                                return bookList;
                            }
                            return wrapper({
                                func: getBookInfoListFn,
                                msg: `尝试从${truncateMiddle(content || bookListUrl || result, 2000)}中创建书籍列表`,
                                isTerminal: true
                            });
                        }


                        defineDataProperties(
                            analyzeRuleModule,
                            undefined, undefined,
                            {
                                //注册analyzeRuleModule独有方法属性

                                getStringByOr,
                                getElementsByOr,
                                getBookInfoList
                            }
                        );

                        return analyzeRuleModule;
                    })();
                }
                case "loginUrl": {
                    return (function () {

                        /**
                         * 检查输入值为JSON，如是则保存; 用于登录UI text控件action输入检查
                         * @param {string} input 
                         * @returns {JSON}
                         */
                        function checkJSONInput(input) {
                            return wrapper({
                                func: checkJSON,
                                params: [input],
                                msg: "请按正确格式输入",
                                isUserCall: true
                            });
                        }

                        /**
                         * 检查输入值为URL，如是则保存; 用于登录UI text控件action输入检查
                         * @param {string} input 
                         * @returns {string}
                         */
                        function checkURLInput(input) {
                            return wrapper({
                                func: checkURL,
                                params: [input],
                                msg: "请按正确格式输入",
                                isUserCall: true
                            });
                        }


                        /**
                         * 获取即时登录UI控件值
                         * @param {string} name - 键名 
                         * @returns {java.lang.String}
                         */
                        function getCurrentLoginInfo(name) {
                            return result.get(name);
                        }

                        /**
                         * 设置登录键值并更新登录UI
                         * @param {string} name 
                         * @param {string} value 
                         */
                        function setCurrentLoginInfo(name, value) {
                            java.upLoginData({
                                [name]: objectToString(value)
                            });
                        }

                        const loginUrlModule = Object.create(generalModule);

                        /**
                         * 从登录result批量添加动态属性到loginUrlModule；默认不可枚举、配置; 会屏蔽来自generalModule中的同名属性; 使用log_前缀区分
                         */
                        defineAccessorProperties(
                            loginUrlModule,
                            getCurrentLoginInfo,
                            setCurrentLoginInfo,
                            undefined,
                            "log_",
                            result
                        );


                        defineDataProperties(
                            loginUrlModule,
                            undefined, undefined,
                            {
                                //注册loginUrlModule独有方法属性
                                getCurrentLoginInfo,
                                setCurrentLoginInfo,
                                checkJSONInput,
                                checkURLInput
                            }
                        );

                        return loginUrlModule;
                    })();
                }
                default:
                    return generalModule;
            }
        })();
    })();
}