/**
 * @file smart js module for legado
 * @version 260124.1
 * @author PlutoGIsolatee <plutoqweguo@126.com>
 * @license LGPL-2.1.only
 */


function PGIModules() {
    const {
        Packages,
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

    //单例模块缓存
    const modules = {
        basicModule: {},
        JsEncodeUtilsModule: {},
        JsExtensionsModule: {},
        AnalyzeRuleModule: {},
        AnalyzeUrlModule: {},
        RssJsExtensionsModule: {},
        SourceLoginJsExtensionsModule: {},
        WebViewModule: {}
    }

    function build(kitName) {

        /**
         * 环境自动判断
         */
        if (!kitName) {
            /**
             * 判断逻辑：主要依Packeges存在性判断宿主环境，
             * 在rhino环境通过java对象的类继承关系判断具体模块类型
             * 继承实现树：
             * JsEncodeUtils Interface
             * └─ JsExtensions Interface
             *    ├─ AnalyzeRule Class
             *    ├─ AnalyzeUrl Class
             *    └─ RssJsExtensions Class
             *        └─ SourceLoginJsExtensions Class
             * 
             * @returns {string} 环境名称
             */
            function deterimineEnvironment() {
                if (!java) {
                    throw new Error("无法识别的运行环境：本模块为legado设计，请在legado源或内置浏览器中使用");
                } else if (!Packages) {
                    return "WebView";
                } else {
                    if (java instanceof Packages.io.legado.app.help.JsEncodeUtils) {
                        if (java instanceof Packages.io.legado.app.help.JsExtensions) {
                            if (java instanceof Packages.io.legado.app.model.analyzeRule.AnalyzeRule) {
                                return "AnalyzeRule";
                            } else if (java instanceof Packages.io.legado.app.model.analyzeRule.AnalyzeUrl) {
                                return "AnalyzeUrl";
                            } else if (java instanceof Packages.io.legado.app.ui.rss.read.RssJsExtensions) {
                                if (java instanceof Packages.io.legado.app.ui.login.SourceLoginJsExtensions) {
                                    return "Login";
                                } else {
                                    return "Rss";
                                }
                            } else {
                                return "General";
                            }
                        } else {
                            return "Basic";
                        }
                    } else {
                        return "Basic";
                    }
                }
            }

            kitName = deterimineEnvironment();
        }

        switch (kitName) {
            case "Basic":
                return BasicModule();
            case "General":
                return JsExtensionsModule();
            case "AnalyzeRule":
                return AnalyzeRuleModule();
            case "AnalyzeUrl":
                return AnalyzeUrlModule();
            case "Rss":
                return RssJsExtensionsModule();
            case "Login":
                return SourceLoginJsExtensionsModule();
            case "WebView":
                return WebViewModule();
            default:
                return BasicModule();
        }
    }

    function BasicModule() {
        if (!modules.basicModule) {
            modules.basicModule = Object.create(null);

            function defineDataPropertiesFromSource(target, source, descriptor = { writable: true }, nameSpace = "") {
                const des = {};
                Object.keys(source).forEach((key) => {
                    const k = nameSpace + key;
                    des[k] = { value: source[key] };
                    Object.assign(des[k], descriptor);
                });
                Object.defineProperties(target, des);
            }

            function defineDataPropertiesFromSources(target, sources, descriptor = { writable: true }, nameSpace = "") {
                const des = {};
                sources.forEach((source) => {
                    Object.keys(source).forEach((key) => {
                        const k = nameSpace + key;
                        des[k] = { value: source[key] };
                        Object.assign(des[k], descriptor);
                    });
                });
                Object.defineProperties(target, des);
            }

            function defineAccessorPropertiesFromSource(
                target,
                source,
                getter = Function.prototype,
                setter = Function.prototype,
                descriptor = {},
                nameSpace = "") {
                const des = {};
                Object.keys(source).forEach((key) => {
                    const k = nameSpace + key;
                    des[k] = {
                        get: getter.bind(target, key),
                        set: setter.bind(target, key)
                    };
                    Object.assign(des[k], descriptor);
                });
                Object.defineProperties(target, des);
            }

            function defineAccessorPropertiesFromSources(
                target,
                sources,
                getter = Function.prototype,
                setter = Function.prototype,
                descriptor = {},
                nameSpace = "") {
                const des = {};
                sources.forEach((source) => {
                    Object.keys(source).forEach((key) => {
                        const k = nameSpace + key;
                        des[k] = {
                            get: getter.bind(target, key),
                            set: setter.bind(target, key)
                        };
                        Object.assign(des[k], descriptor);
                    });
                });
                Object.defineProperties(target, des);
            }

            /**
             * @typedef {Object} URI
             * @property {string} scheme - 协议
             * @property {string} host - 主机名
             * @property {number} port - 端口号
             * @property {string} path - 路径; 未编码
             * @property {Object} query - 查询参数对象; 未编码
             * @property {string} fragment - 片段标识符; 未编码
             * @property {string} encodedPath - 路径; 编码后
             * @property {string} encodedQueryString - 查询字符串; 编码后
             * @property {string} encodedFragment - 片段标识符; 编码后
             * @property {Function} toString - 编码后
             * @property {Function} toRawString - 未编码
             */

            const URI_DATA_KEY = Symbol("URI_DATA_KEY");

            /**
             * java.net.URI封装
             * @param {string|Object} params - URI字符串或URI参数对象
             * @param {string} [params.scheme] - URI协议，如http、https
             * @param {string} [params.host] - 主机名，如www.example.com
             * @param {number} [params.port] - 端口号，如80、443
             * @param {string} [params.path] - 路径，如/index.html
             * @param {Object} [params.query] - 查询参数对象，如{key1: "value1", key2: "value2"}
             * @param {string} [params.fragment] - 片段标识符，如section1
             */
            function URI(param, base) {
                this[URI_DATA_KEY] = {};

                if (typeof param === "string") {
                    if (base) {
                        this[URI_DATA_KEY].uri = URI.createJavaURIFromRelative(param, base);
                    } else {
                        this[URI_DATA_KEY].uri = URI.createJavaURIFromString(param);
                    }
                } else if (typeof param === "object") {
                    this[URI_DATA_KEY].uri = URI.createJavaURIFromComponents(param);
                }

                this[URI_DATA_KEY].scheme = this[URI_DATA_KEY].uri.getScheme();
                this[URI_DATA_KEY].host = this[URI_DATA_KEY].uri.getHost();
                this[URI_DATA_KEY].port = this[URI_DATA_KEY].uri.getPort();
                this[URI_DATA_KEY].path = this[URI_DATA_KEY].uri.getPath();
                this[URI_DATA_KEY].query = URI.queryParse(this[URI_DATA_KEY].uri.getQuery() || "");
                this[URI_DATA_KEY].fragment = this[URI_DATA_KEY].uri.getFragment();
            }

            URI.prototype.getJavaURI = function () {
                if (!this[URI_DATA_KEY].uri) {
                    this[URI_DATA_KEY].uri = URI.createJavaURIFromComponents({
                        scheme: this[URI_DATA_KEY].scheme,
                        host: this[URI_DATA_KEY].host,
                        port: this[URI_DATA_KEY].port,
                        path: this[URI_DATA_KEY].path,
                        query: this[URI_DATA_KEY].query,
                        fragment: this[URI_DATA_KEY].fragment
                    });
                }
                return this[URI_DATA_KEY].uri;
            };

            URI.upData = function (instance, key, value) {
                instance[URI_DATA_KEY][key] = value;
                instance[URI_DATA_KEY].uri = null;
            };

            ["scheme", "host", "port", "path", "query", "fragment"].forEach((key) => {
                const name = key.charAt(0).toUpperCase() + key.slice(1);
                URI.prototype["get" + name] = function () {
                    return this[URI_DATA_KEY][key];
                };
                URI.prototype["set" + name] = function (value) {
                    URI.upData(this, key, value);
                };
            });

            URI.prototype.mergeQuery = function (queryObj) {
                URI.upData(this, "query", Object.assign({}, this[URI_DATA_KEY].query, queryObj));
            };

            ["encodedPath", "encodedQueryString", "encodedFragment"].forEach((key) => {
                const name = key.charAt(0).toUpperCase() + key.slice(1);
                URI.prototype["get" + name] = function () {
                    return this.getJavaURI()["get" + name.replace("encoded", "")]();
                };
            });

            URI.prototype.toString = function () {
                return String(this.getJavaURI().toASCIIString());
            };
            URI.prototype.toRawString = function () {
                return String(this.getJavaURI().toString());
            };


            URI.JavaURI = Packages.java.net.URI;

            URI.createJavaURIFromString = function (str) {
                return new URI.JavaURI(str);
            };

            URI.createJavaURIFromRelative = function (relative, base) {
                return new URI.JavaURI(base).resolve(new URI.JavaURI(relative));
            }

            URI.createJavaURIFromComponents = function (components) {
                return new URI.JavaURI(
                    components.scheme || "http",
                    null,
                    components.host || null,
                    components.port || -1,
                    components.path || null,
                    URI.queryStringfy(components.query) || null,
                    components.fragment || null
                );
            };

            /**
             * 查询参数对象转查询字符串; 未编码
             * @param {Object} queryObj 
             */
            URI.queryStringfy = function (queryObj) {
                return Object.keys(queryObj).map(key => {
                    return key + "=" + queryObj[key];
                }).join("&");
            }

            /**
             * 查询字符串转查询参数对象; 未编码
             * @param {string} queryString 
             */
            URI.queryParse = function (queryString) {
                const queryObj = {};
                queryString.split("&").forEach(pair => {
                    const [key, value] = pair.split("=");
                    queryObj[key] = value;
                });
                return queryObj;
            }

            /**
             * 解析相对URI
             * @param {string} relative
             * @param {string} base
             * @return {string} 绝对URI字符串
             */
            URI.resolve = function (relative, base) {
                return String(URI.createJavaURIFromRelative(relative, base).toASCIIString());
            }

            function getAbsoluteURL(relative, base) {
                return URI.resolve(relative, base);
            }

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
             * 检查格式
             * @param {Function} action - 接受content参数
             * @param {any} content
             * @param {Function} [errorCallback]
             * @param {boolean} [doThrow = true]
             * @returns {boolean}
             */
            function checkFormat(action, content, errorCallback = null, doThrow = true) {
                try {
                    action(content);
                    return true;
                } catch (e) {
                    if (errorCallback) {
                        errorCallback();
                    }
                    if (doThrow) {
                        throw e;
                    }
                    return false;
                }
            }

            /**
             * 检查字符串为合法JSON
             * @param {string} content
             * @param {Function} [errorCallback = null] - 出错回调
             * @param {boolean} [doThrow = true] - 是否抛出异常
             * @returns {boolean}
             */
            function checkJSON(content, errorCallback = null, doThrow = true) {
                return checkFormat(JSON.parse, content, errorCallback, doThrow);
            }

            /**
             * 检查字符串为合法URI
             * @param {string} content
             * @param {Function} [errorCallback = null] - 出错回调
             * @param {boolean} [doThrow = true] - 是否抛出异常
             * @returns {boolean}
             */
            function checkURI(content, errorCallback = null, doThrow = true) {
                return checkFormat(URI.createJavaURIFromString, content, errorCallback, doThrow);
            }

            /**
             * 较安全的类型转换; 对于JAVA对象调用其toString方法
             * @param {any} obj
             * @returns {string}
             */
            function objectToString(obj) {
                if (obj === null || obj === undefined) {
                    return String(obj);
                } else if (typeof obj === "object") {
                    if (obj instanceof Packages.java.lang.Object) {
                        return String(obj);
                    } else {
                        try {
                            return JSON.stringify(obj);
                        } catch {
                            return String(obj);
                        }
                    }
                } else {
                    return String(obj);
                }
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

            const ERROR_TO_STRING_DEFAULT_MAX_DEPTH = 10;
            const ERROR_TO_STRING_DEFAULT_MAX_MESSAGE_LENGTH = 2000;

            /**
             * Error转string
             * 实现了自定义ExtraMessage属性用于额外堆栈描述; 实现了rhino 提供的stack属性形如：at <source>:lineNumber (functionName)
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

                function errorToStringSingle(error) {
                    if (error === null || error === undefined) {
                        return String(error);
                    }
                    let name = error.name || "Error";
                    let message = error.message ? truncateMiddle(error.message, maxMessageLength) : "";
                    let extraMessage = error.extraMessage ? "\n" + truncateMiddle(error.extraMessage, maxMessageLength) : "";
                    return `${name}${message ? ": " + message : ""}${extraMessage}`;
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

                return error.stack + "\n" + errorToStringSingle(error) + "\n" + causeChain;
            }

            defineDataPropertiesFromSource(modules.basicModule, {
                URI,
                getAbsoluteURL,
                curry,
                checkJSON,
                checkURI,
                objectToString,
                truncateMiddle,
                errorToString,
                defineAccessorPropertiesFromSource,
                defineAccessorPropertiesFromSources,
                defineDataPropertiesFromSource,
                defineDataPropertiesFromSources
            });
        }
        return modules.basicModule;
    }

    function JsExtensionsModule() {
        if (!modules.JsExtensionsModule) {
            const basicModule = BasicModule();

            const CONSOLE_DEFAULT_MAX_LENGTH = 2000;

            /**
             * 消息输出
             * @param {Array<any>} messageSources
             * @param {Object} [options]
             * @param {number} [options.maxLength = CONSOLE_DEFAULT_MAX_LENGTH]
             * @param {boolean} [options.itemize = true] - 是否分项输出
             */
            function Console(messageSources, {
                maxLength = CONSOLE_DEFAULT_MAX_LENGTH,
                itemize = true
            } = {}) {
                this.messages = messageSources.map(objectToString).map(msg => truncateMiddle(msg, maxLength));
                this.maxLength = maxLength;
                this.itemize = itemize;
                if (!this.itemize) {
                    this.message = this.messages.join("\n- ");
                }
            }
            function ConsoleOutputter(method) {
                return function () {
                    if (this.itemize) {
                        this.messages.forEach(msg => {
                            method(msg);
                        });
                    } else {
                        method(this.message);
                    }
                }
            }
            Console.prototype.log = ConsoleOutputter(java.log.bind(java));
            Console.prototype.toast = ConsoleOutputter(java.toast.bind(java));
            Console.prototype.longToast = ConsoleOutputter(java.longToast.bind(java));
            Console.prototype.toastLog = ConsoleOutputter(msg => {
                java.toast(java.log(msg));
            });
            Console.prototype.longToastLog = ConsoleOutputter(msg => {
                java.longToast(java.log(msg));
            });

            function log(...messageSources) {
                new Console(messageSources).log();
            }
            function toast(...messageSources) {
                new Console(messageSources).toast();
            }
            function longToast(...messageSources) {
                new Console(messageSources).longToast();
            }
            function toastLog(...messageSources) {
                new Console(messageSources).toastLog();
            }
            function longToastLog(...messageSources) {
                new Console(messageSources).longToastLog();
            }

            /**
             * 源变量初始值
             * @type {JSON}
             */
            const INITIAL_SOURCE_VARIABLE = {
                user_id: 0,
                user_key: "",
                baseUrl: "https://zh.pkuedu.online/",
                filter: [],
                doFilter: true,
                doCheck: false,
                storage: {}
            };

            /*
            function checkVariable() {
                try {
                    let v = source.getVariable();
                    if (!v || v.isEmpty()) {
                        throw new Error();
                    }
                    return JSON.parse(v);
                } catch {
                    let v = INITIAL_SOURCE_VARIABLE;
                    source.setVariable(JSON.stringify(v));
                    java.log("已重置源变量");
                    return v;
                }
            }

            
            function setVariableValue(key, value) {
                let va = checkVariable();
                va[key] = value;
                source.setVariable(JSON.stringify(va));
                return java.log(`已设置 ${key} 为 ${value}`) + "\n";
            }

            function getVariableValue(key) {
                var va = checkVariable();
                return va[key];
            }
                */

            const SourceVariable = Object.create(null);

            SourceVariable.init = function init() {
                source.setVariable(JSON.stringify(INITIAL_SOURCE_VARIABLE));
                java.log("已初始化源变量");
                return INITIAL_SOURCE_VARIABLE;
            };

            Object.defineProperty(SourceVariable, "data", {
                get: function () {
                    try {
                        let value = source.getVariable();
                        if (!value || value.isEmpty()) {
                            throw new Error();
                        }
                        return JSON.parse(value);
                    } catch {
                        return SourceVariable.init();
                    }
                }
            });

            /**
             * @todo
             */



            modules.JsExtensionsModule = Object.create(basicModule);
            basicModule.defineDataPropertiesFromSource(
                modules.JsExtensionsModule,
                {
                    Console,
                    log,
                    toast,
                    longToast,
                    toastLog,
                    longToastLog
                }
            );
        }
        return modules.JsExtensionsModule;
    }

    return { build };
}


















/**
 * @deprecated 待重构
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