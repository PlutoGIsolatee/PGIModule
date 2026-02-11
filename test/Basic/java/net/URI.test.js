@js:
/**
 * Failed
 * @todo URI.Query类
 */

const URI_JAVA_CLASS_URI = Symbol("URI.JavaClassURI");
const URI_JAVA_CLASS_URI_INSTANCE = Symbol("URI.prototype.javaClassURIInstanceKey");
const URI_DATA = Symbol("URI.data");
const URI_GET_JAVA_URI = Symbol("URI.prototype.getJavaURI");
const URI_STATIC_CREATE_JAVA_URI_FROM_COMPONENTS = Symbol("URI.createJavaURIFromComponents");
const URI_UP_DATA = Symbol("URI.prototype.upData");
const URI_GET_COMPONENT = Symbol("URI.prototype.getComponent");
const URI_STATIC_CREATE_COMPONENT_CONSTANT = Symbol("URI.createComponentConstant");



function URI(uriStr) {
    const instance = this[URI_JAVA_CLASS_URI_INSTANCE] = new URI[URI_JAVA_CLASS_URI](uriStr);
    const data = this[URI_DATA] = {};

    data.scheme = instance.getScheme();
    data.host = instance.getHost();
    data.port = instance.getPort();
    data.path = instance.getPath();
    data.query = URI.parseQuery(String(instance.getQuery()) || "");
}



URI[URI_JAVA_CLASS_URI] = Packages.java.net.URI;


URI[URI_STATIC_CREATE_COMPONENT_CONSTANT] = function createComponentConstant(name) {
    function lowerCamel(...words) {
        return words.map((e, i) => {
            if (i === 0) {
                return e;
            }
            return e.at(0).toUpperCase() + e.slice(1);
        }).join("");
    }
    return {
        name,
        get: lowerCamel("get", name),
        set: lowerCamel("set", name)
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
    query = {},
    fragment = null
}) {
    return new URI[URI_JAVA_CLASS_URI](
        scheme,
        null,
        host,
        port,
        path,
        URI.buildQuery(query),
        fragment
    );
};


/**
 * 过滤非法内容
 */
URI.parseQuery = function parseQuery(queryStr) {
    const queryObj = {};
    queryStr.split("&").filter(p => /.=./.test(p))
        .forEach(pair => {
            const [key, value] = pair.split("=");
            queryObj[key] = value;
        });
    return queryObj;
};

URI.buildQuery = function buildQuery(queryObj) {
    return Object.entries(queryObj).map(([key, value]) => (key + "=" + value))
        .join("&");
};


URI.prototype[URI_GET_JAVA_URI] = function getJavaURI() {
    const instance = this[URI_JAVA_CLASS_URI_INSTANCE];
    const data = this[URI_DATA];
    if (!instance) {
        this[URI_JAVA_CLASS_URI_INSTANCE] = URI[URI_STATIC_CREATE_JAVA_URI_FROM_COMPONENTS](data);
    }
    return this[URI_JAVA_CLASS_URI_INSTANCE];
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
URI.prototype.setQuery = function(queryObj) {
    this[URI_UP_DATA]("query", queryObj);
};
URI.prototype.setFragment = function(fragmentStr) {
    this[URI_UP_DATA]("fragment", fragmentStr);
};


URI.prototype[URI_GET_COMPONENT] = function getComponent({
    name,
    get
    }) {
    if (this[URI_DATA][name]) {
        return String(this[URI_DATA][name]);
    } else if (this[URI_JAVA_CLASS_URI_INSTANCE]) {
        const v = String(this[URI_JAVA_CLASS_URI_INSTANCE][get]());
        if(name === URI.QUERY.name){
            return this[URI_DATA][name] = URI.parseQuery(v);
            }
        return this[URI_DATA][name] = v;
    }
};

URI.prototype.getScheme = function getScheme(){
    return this[URI_GET_COMPONENT](URI.SCHEME);
    };
URI.prototype.getPort = function getPort(){
    return Number(this[URI_GET_COMPONENT](URI.PORT));
    };
URI.prototype.getHost = function getHost(){
    return this[URI_GET_COMPONENT](URI.HOST);
    };
URI.prototype.getPath = function getPath(){
    return this[URI_GET_COMPONENT](URI.PATH);
    };
    URI.prototype.getFragment = function getFragment(){
    return this[URI_GET_COMPONENT](URI.FRAGMENT);
    };
URI.prototype.getQuery = function getPort(){
    return this[URI_GET_COMPONENT](URI.QUERY);
    };
    
    
    
test("静态测试", () => {});

test("parseQuery测试", () => {
    expect(URI.parseQuery("a=q&b=w").a).toBe("q");

    expect(Object.keys(URI.parseQuery("")).length).toBe(0);
});

test("buildQuery测试", () => {
    expect(URI.buildQuery({
        a: 1,
        b: 2
    })).toBe("a=1&b=2");

    expect(URI.buildQuery({})).toBe("");
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
    expect(String(uri[URI_GET_JAVA_URI]())).toBe("https://www.baidu.com?");
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

// 测试 setQuery 方法 (参数为对象)
test("setQuery 方法测试", () => {
    const uri = new URI("https://www.example.com:8080/path?key=value#fragment");
    const newQuery = {
        name: "test",
        page: 1
    };
    uri.setQuery(newQuery);
    expect(uri[URI_JAVA_CLASS_URI_INSTANCE]).toBe(null);
    // 假设getQuery()返回查询字符串，这里验证其包含关键参数
    const queryString = String(uri[URI_GET_JAVA_URI]().getQuery());
    expect(queryString).toContain("name=test");
    expect(queryString).toContain("page=1");
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
    const queryStr = URI.buildQuery(query);
    // 验证查询字符串包含关键参数，注意参数顺序可能不固定
    expect(queryStr).toContain("key1=val1");
    expect(queryStr).toContain("key2=val2");
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
});
 