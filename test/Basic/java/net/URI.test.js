@js:
/**
 * OK
 * @todo Query.prototype.values代理
 * @todo 编码字符集设置
 */

const URI_JAVA_CLASS_URI = Symbol("URI.JavaClassURI");
const URI_JAVA_CLASS_URI_INSTANCE = Symbol("URI.prototype.javaClassURIInstanceKey");
const URI_DATA = Symbol("URI.data");
const URI_GET_JAVA_URI = Symbol("URI.prototype.getJavaURI");
const URI_STATIC_CREATE_JAVA_URI_FROM_COMPONENTS = Symbol("URI.createJavaURIFromComponents");
const URI_UP_DATA = Symbol("URI.prototype.upData");
const URI_GET_COMPONENT = Symbol("URI.prototype.getComponent");
const URI_STATIC_CREATE_COMPONENT_CONSTANT = Symbol("URI.createComponentConstant");
const URI_QUERY_MAP = Symbol("URI.Query.map");
const URI_JAVA_CLASS_URL_ENCODER = Symbol("URI.JavaClassURLEncoder");
const URI_JAVA_CONSTANT_UTF_8_NAME = Symbol("URI.javaConstantUTF8Name");



function URI(uriStr) {
    const instance = this[URI_JAVA_CLASS_URI_INSTANCE] = new URI[URI_JAVA_CLASS_URI](uriStr);
    const data = this[URI_DATA] = {};

    const nullPro2Str = value => value == null ? null : String(value);


    data.scheme = nullPro2Str(instance.getScheme());
    data.host = nullPro2Str(instance.getHost());
    data.port = nullPro2Str(instance.getPort());
    data.path = nullPro2Str(instance.getPath());
    data.fragment = nullPro2Str(instance.getFragment());
    const query = instance.getQuery();
    data.query = query ? URI.Query.parse(String(query)) :
        null;
}



URI[URI_JAVA_CLASS_URI] = Packages.java.net.URI;

URI[URI_JAVA_CLASS_URL_ENCODER] = Packages.java.net.URLEncoder;

URI[URI_JAVA_CONSTANT_UTF_8_NAME] = Packages.java.nio.charset.StandardCharsets.UTF_8.name();


URI[URI_STATIC_CREATE_COMPONENT_CONSTANT] = function createComponentConstant(name) {
    function lowerCamel(...words) {
        return words.map((e, i) => {
            if (i === 0) return e;
            return e.at(0).toUpperCase() + e.slice(1);
        }).join("");
    }
    return {
        name,
        get: lowerCamel("get", name)
    };
};

URI.SCHEME = URI[URI_STATIC_CREATE_COMPONENT_CONSTANT]("scheme");
URI.HOST = URI[URI_STATIC_CREATE_COMPONENT_CONSTANT]("host");
URI.PORT = URI[URI_STATIC_CREATE_COMPONENT_CONSTANT]("port");
URI.PATH = URI[URI_STATIC_CREATE_COMPONENT_CONSTANT]("path");
URI.QUERY = URI[URI_STATIC_CREATE_COMPONENT_CONSTANT]("query");
URI.FRAGMENT = URI[URI_STATIC_CREATE_COMPONENT_CONSTANT]("fragment");


URI[URI_STATIC_CREATE_JAVA_URI_FROM_COMPONENTS] = function createJavaURIFromComponents({
    scheme = null,
    host = null,
    port = -1,
    path = null,
    query = null,
    fragment = null
}) {
    return new URI[URI_JAVA_CLASS_URI](
        scheme,
        null,
        host,
        port,
        path,
        query,
        fragment
    );
};

URI.encode = function encode(raw) {
    return String(URI[URI_JAVA_CLASS_URL_ENCODER].encode(raw, URI[URI_JAVA_CONSTANT_UTF_8_NAME]));
};



/**
 * 
 * @param {Array<Array<string | Array<string>>>} 形如[[k1, v1], [k2, [v2, v3]], [k2, v4]]
 */
URI.Query = function(entriesArr = []) {
    const map = this[URI_QUERY_MAP] = new Map();
    entriesArr
        .filter(([, values]) => values?.length > 0)
        .forEach(([key, values]) => {
            const valArr = Array.isArray(values) ? values : [values];
            valArr.forEach(value => {
                if (map.has(key)) {
                    map.get(key).push(value);
                } else {
                    map.set(key, [value]);
                }
            });
        });
};

URI.Query.parse = function parse(queryStr) {
    const query = new URI.Query();
    queryStr.split("&").filter(p => /.=./.test(p))
        .forEach(pair => {
            const [key, value] = pair.split("=");
            query.add(key, value)
        });
    return query;
};

URI.Query.prototype.add = function add(key, value) {
    const map = this[URI_QUERY_MAP];
    if (!key || !value) throw new TypeError("请输入非空字符串");
    if (map.has(key)) {
        map.get(key).push(value);
    } else {
        map.set(key, [value]);
    }
};

URI.Query.prototype.values = function values(key) {
    return this[URI_QUERY_MAP].get(key);
};

URI.Query.prototype.build = function build() {
    const encode = URI.encode;
    const map = this[URI_QUERY_MAP] || new Map();
    return Array.from(map.entries())
        .filter(([, values]) => values?.length > 0)
        .flatMap(([key, values]) => {
            return values.map(value =>
                encode(key) + '=' + encode(value)
            );
        })
        .join('&');
};

URI.Query.prototype.toString = function toString() {
    return this.build();
};



URI.prototype[URI_GET_JAVA_URI] = function getJavaURI() {
    return this[URI_JAVA_CLASS_URI_INSTANCE] ??= URI[URI_STATIC_CREATE_JAVA_URI_FROM_COMPONENTS](this[URI_DATA]);
};


URI.prototype[URI_UP_DATA] = function upData(key, value) {
    this[URI_JAVA_CLASS_URI_INSTANCE] = null;
    this[URI_DATA][key] = value;
};

URI.prototype.setScheme = function(schemeStr) {
    this[URI_UP_DATA]("scheme", schemeStr);
};
URI.prototype.setHost = function(hostStr) {
    this[URI_UP_DATA]("host", hostStr);
};
URI.prototype.setPort = function(portNum) {
    this[URI_UP_DATA]("port", portNum);
};
URI.prototype.setPath = function(pathStr) {
    this[URI_UP_DATA]("path", pathStr);
};
URI.prototype.setQuery = function(query) {
    this[URI_UP_DATA]("query", query);
};
URI.prototype.setFragment = function(fragmentStr) {
    this[URI_UP_DATA]("fragment", fragmentStr);
};


URI.prototype[URI_GET_COMPONENT] = function getComponent({
    name,
    get
}) {
    return String(this[URI_DATA][name]);
};

URI.prototype.getScheme = function getScheme() {
    return this[URI_GET_COMPONENT](URI.SCHEME);
};
URI.prototype.getPort = function getPort() {
    return Number(this[URI_GET_COMPONENT](URI.PORT));
};
URI.prototype.getHost = function getHost() {
    return this[URI_GET_COMPONENT](URI.HOST);
};
URI.prototype.getPath = function getPath() {
    return this[URI_GET_COMPONENT](URI.PATH);
};
URI.prototype.getFragment = function getFragment() {
    return this[URI_GET_COMPONENT](URI.FRAGMENT);
};
URI.prototype.getQuery = function getQuery() {
    return URI.Query.parse(this[URI_GET_COMPONENT](URI.QUERY));
};

URI.prototype.build = function build() {
    return String(this[URI_GET_JAVA_URI]());
};

URI.prototype.toString = function toString() {
    return this.build();
};



test("静态测试", () => {});

test("Query构造测试", () => {
    new URI.Query([]);
    new URI.Query();
});

test("Query build测试", () => {
    expect((new URI.Query()).build())
        .toBe("");
    expect((new URI.Query([
            ["a", ["我", "你"]],
            ["b", "它"],
            ["c"]
        ])).build())
        .toContain("a=%E6%88%91")
        .toContain("a=%E4%BD%A0")
        .toContain("b=")
        .toNotContain("c=")
        .log(java)
});



test("实例化测试", () => {
    const uri = new URI("https://www.baidu.com");
});

test("常量注册测试", () => {
    expect(URI.HOST.get).toBe("getHost");
});

test("getJavaURI测试", () => {
    const uri = new URI("https://www.baidu.com");
    uri[URI_JAVA_CLASS_URI_INSTANCE] = null;
    expect(String(uri[URI_GET_JAVA_URI]())).toBe("https://www.baidu.com");
});

test("upData测试", () => {
    const uri = new URI("https://www.baidu.com");
    uri[URI_UP_DATA]("scheme", "http");
    expect(uri[URI_JAVA_CLASS_URI_INSTANCE]).toBe(null);
    expect(String(uri[URI_GET_JAVA_URI]().getScheme())).toBe("http");
});

// 测试 setScheme 方法
test("setScheme 方法测试", () => {
    const uri = new URI("https://www.example.com:8080/path?key=value#fragment");
    uri.setScheme("http");
    // 验证调用更新方法后，URI实例缓存被清空（根据示例逻辑推断）
    expect(uri[URI_JAVA_CLASS_URI_INSTANCE]).toBe(null);
    // 验证底层Java URI对象的scheme已被正确修改
    expect(String(uri[URI_GET_JAVA_URI]().getScheme())).toBe("http");
});

// 测试 setHost 方法
test("setHost 方法测试", () => {
    const uri = new URI("https://www.example.com:8080/path?key=value#fragment");
    uri.setHost("newsite.com");
    expect(uri[URI_JAVA_CLASS_URI_INSTANCE]).toBe(null);
    expect(String(uri[URI_GET_JAVA_URI]().getHost())).toBe("newsite.com");
});

// 测试 setPort 方法
test("setPort 方法测试", () => {
    const uri = new URI("https://www.example.com:8080/path?key=value#fragment");
    uri.setPort(9090);
    expect(uri[URI_JAVA_CLASS_URI_INSTANCE]).toBe(null);
    expect(uri[URI_GET_JAVA_URI]().getPort()).toBe(9090);
});

// 测试 setPath 方法
test("setPath 方法测试", () => {
    const uri = new URI("https://www.example.com:8080/path?key=value#fragment");
    uri.setPath("/new/path");
    expect(uri[URI_JAVA_CLASS_URI_INSTANCE]).toBe(null);
    expect(String(uri[URI_GET_JAVA_URI]().getPath())).toBe("/new/path");
});

test("setQuery 方法测试", () => {
    const uri = new URI("https://www.example.com:8080/path?key=value#fragment");
    const newQuery = new URI.Query([
        ["name", "test"],
        ["page", "1"]
    ]);
    uri.setQuery(newQuery);
    expect(uri[URI_JAVA_CLASS_URI_INSTANCE]).toBe(null);
    const queryString = String(uri[URI_GET_JAVA_URI]().getQuery());
    expect(queryString)
        .log(java)
        .toContain("name=test")
        .toContain("page=1")

});

// 测试 setFragment 方法
test("setFragment 方法测试", () => {
    const uri = new URI("https://www.example.com:8080/path?key=value#fragment");
    uri.setFragment("newSection");
    expect(uri[URI_JAVA_CLASS_URI_INSTANCE]).toBe(null);
    expect(String(uri[URI_GET_JAVA_URI]().getFragment())).toBe("newSection");
});

test("getComponent测试", () => {
    const uri = new URI("https://www.example.com:8080/path?key=value#fragment");
    expect(String(uri[URI_GET_COMPONENT](URI.SCHEME))).toBe("https");
});


// 测试：基础URI组件的获取
test("getScheme 方法测试 - 应正确返回协议头", () => {
    const uri = new URI("https://www.example.com:8080/path/to/resource?name=value#section");
    const scheme = uri.getScheme();
    expect(scheme).toBe("https");
});

test("getHost 方法测试 - 应正确返回主机名", () => {
    const uri = new URI("https://www.example.com:8080/path/to/resource?name=value#section");
    const host = uri.getHost();
    expect(host).toBe("www.example.com");
});

test("getPort 方法测试 - 应正确返回端口号", () => {
    const uri = new URI("https://www.example.com:8080/path/to/resource?name=value#section");
    const port = uri.getPort();
    expect(port).toBe(8080);
});

test("getPath 方法测试 - 应正确返回路径", () => {
    const uri = new URI("https://www.example.com:8080/path/to/resource?name=value#section");
    const path = uri.getPath();
    expect(path).toBe("/path/to/resource");
});

test("getQuery 方法测试 - 应正确返回查询对象", () => {
    const uri = new URI("https://www.example.com:8080/path?key1=val1&key2=val2#section");
    const query = uri.getQuery();
    const queryStr = query.build();
    // 验证查询字符串包含关键参数，注意参数顺序可能不固定
    expect(queryStr)
        .toContain("key1=val1")
        .toContain("key2=val2");
});

test("getFragment 方法测试 - 应正确返回片段标识", () => {
    const uri = new URI("https://www.example.com:8080/path/to/resource?name=value#section");
    const fragment = uri.getFragment();
    expect(fragment).toBe("section");
});

// 测试：边界与特殊情况
test("getQuery 方法测试 - 处理无查询参数的URI", () => {
    const uri = new URI("https://www.example.com/path#section");
    const query = uri.getQuery();
    expect(Object.keys(query).length).toBe(0);
});

test("getPort 方法测试 - 处理默认端口（隐式）", () => {
    // HTTPS默认端口443，HTTP默认端口80，在URI中通常省略
    const uriHttps = new URI("https://www.example.com/path");
    const uriHttp = new URI("http://www.example.com/path");
    expect(uriHttps.getPort()).toBe(-1);

    expect(uriHttp[URI_GET_JAVA_URI]().getPort()).toBe(-1);
});

// 测试：结合setter方法，验证设置后能正确获取（集成测试）
test("setter与getter集成测试 - 修改后能正确反映新值", () => {
    const uri = new URI("https://oldhost.com/oldpath");
    uri.setHost("newhost.com");
    uri.setPath("/newpath");
    // 验证内部缓存已清空（根据您的设计）
    expect(uri[URI_JAVA_CLASS_URI_INSTANCE]).toBe(null);
    // 重新获取Java URI对象并验证新值
    const javaUri = uri[URI_GET_JAVA_URI]();
    expect(String(javaUri.getHost())).toBe("newhost.com");
    expect(String(javaUri.getPath())).toBe("/newpath");

    expect(uri.getHost()).toBe("newhost.com");
    expect(uri.getPath()).toBe("/newpath");
    expect(uri.toString()).toBe("https://newhost.com/newpath");
});