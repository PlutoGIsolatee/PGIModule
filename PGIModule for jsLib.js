/**
 * 
 * @param {string} [kitName] - 为空时自动判断环境创建模块实例
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

    if (!kitName) {
        if (java.getElement) {
            kitName = "analyzeRuleModule";
        } else {
            kitName = "analyzeUrlModule";
        }
    }

    return (function() {
        /**
         * 定义无依赖方法属性
         * =========================
         */

        /**
         * 较安全的类型转换；对于JAVA对象调用其toString方法
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

        /**
         * 字符串限长，从中央以省略标识代替超字数部分
         * @param {any} source
         * @param {number} [maxLength = 500]
         * @param {string} [ellipsis = "'\n......\n'"] 省略标识
         * @returns {string}
         */
        function truncateMiddle(source, maxLength = 500, ellipsis = '\n......\n') {
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
         *拼接相对链接
         *@param {string} baseurl - 基准URL
         *@param {string} relativePath - 相对URL
         *@return {string} 绝对URL
         */
        function getAbsoluteUrl(baseurl, relativePath) {
            if (baseurl.endsWith("/") && relativePath.startsWith("/")) {
                return baseurl.slice(0, -1) + relativePath;
            } else if (!baseurl.endsWith("/") && !relativePath.startsWith("/")) {
                return baseurl + "/" + relativePath;
            } else {
                return baseurl + relativePath;
            }
        }

        /**
         * Error转string；实现了自定义ExtraMessage属性用于额外堆栈描述
         * @param {Error} error
         * @param {number} [maxDepth = 10] - cause栈遍历深度限度
         * @param {number} [maxMessageLength = 2000]
         * @returns {string} 形如Error: msg\nextraMessage\n<= Error: msg\nextraMessage\n...
         * @throws {TypeError} 首个参数应为Error类型
         */
        function errorToString(error, maxDepth = 5, maxMessageLength = 2000) {
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



        const basicModule = {
            //注册无依赖方法属性
            objectToString,
            getAbsoluteUrl,
            truncateMiddle,
            errorToString
        };


        return (function() {

            const generalModule = Object.create(basicModule);

            /**
             * 定义使用通用API方法属性
             * =========================
             */

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
                        10000)
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
                        10000)
                ));
            }

            /**
             * 源变量初始值
             */
            const initialSourceVariable = {
                user_id: 0,
                user_key: "",
                baseUrl: "https://zh.pkuedu.online/",
                filter: [],
                doFilter: true,
                doCheck: true
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
                    let va = initialSourceVariable;
                    source.setVariable(JSON.stringify(va));
                    java.log("已重置源变量");
                    return va;
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

            /**
             * 从initialSourceVariable批量添加动态属性到generalModule；默认不可枚举、配置
             */
            const descriptors = {};
            Object.keys(initialSourceVariable).forEach((key) => {
                descriptors[key] = {
                    get() {
                        return getVariableValue(key);
                    },
                    set(value) {
                        setVariableValue(key, value);
                    }
                };
            });
            Object.defineProperties(generalModule, descriptors);

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
                isUserCall = false
            }) {
                try {
                    if ((typeof func) !== "function") {
                        throw new TypeError(`wrapper()参数func属性应为Function`);
                    }

                    const useLongToast = isUserCall || longToast,
                        useToast = toast;

                    try {
                        var funcResult = func.apply(funcThis || this, params);

                        const funcStr = truncateMiddle(funcResult, 1000);
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
                        longToastLog(errorToString(error));
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
                    url = getAbsoluteUrl(baseurl, `${relativePath},${urlparams}`);
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
             *内置浏览器打开当前网页
             */
            function enterCurrentWebpage() {
                java.startBrowser(baseUrl, source.getTag());
            };


            Object.assign(generalModule, {
                //注册使用通用API方法属性
                initialSourceVariable,
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
                enterCurrentWebpage
            });




            switch (kitName) {
                case "basicModule": {
                    return basicModule;
                }
                case "generalModule": {
                    return generalModule;
                }
                case "analyzeRuleModule": {
                    return (function() {
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
                                msg: `尝试以${String(selectors)}获取文本`
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
                         * @return {Array<Object>} 书籍信息列表
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



                        Object.assign(analyzeRuleModule, {
                            //注册analyzeRuleModule独有方法属性

                            getStringByOr,
                            getElementsByOr,
                            getBookInfoList
                        });

                        return analyzeRuleModule;
                    })();
                }

                case "analyzeUrlModule": {
                    return (function() {
                        const analyzeUrlModule = Object.create(generalModule);

                        /**
                         * 定义analyzeUrlModule独有方法属性
                         * =========================
                         */

                        Object.assign(analyzeUrlModule, {
                            //注册analyzeUrlModule独有方法属性

                        });

                        return analyzeUrlModule;
                    })();
                }
            }
        })();
    })();
}