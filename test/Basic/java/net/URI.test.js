@js:
/**
 * OK
 */

const URI_JAVA_CLASS_URI = Symbol("URI.JavaClassURI");
const URI_JAVA_CLASS_URI_INSTANCE = Symbol("URI.prototype.javaClassURIInstanceKey");
const URI_DATA = Symbol("URI.data");
const URI_METHOD_GET_JAVA_URI = Symbol("URI.prototype.getJavaURI");
const URI_STATIC_METHOD_CREATE_JAVA_URI_FROM_COMPONENTS = Symbol("URI.createJavaURIFromComponents");
const URI_METHOD_UP_DATA = Symbol("URI.prototype.upData");

function URI(uriStr) {
    const instance = this[URI_JAVA_CLASS_URI_INSTANCE] = new URI[URI_JAVA_CLASS_URI](uriStr);
    const data = this[URI_DATA] = {};

    data.scheme = instance.getScheme();
    data.host = instance.getHost();
    data.port = instance.getPort();
    data.path = instance.getPath();
    data.query = URI.parseQuery(instance.getQuery() || "");
}



URI[URI_JAVA_CLASS_URI] = Packages.java.net.URI;

URI[URI_STATIC_METHOD_CREATE_JAVA_URI_FROM_COMPONENTS] = function createJavaURIFromComponents({
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

URI.prototype[URI_METHOD_GET_JAVA_URI] = function getJavaURI() {
    const instance = this[URI_JAVA_CLASS_URI_INSTANCE];
    const data = this[URI_DATA];
    if (!instance) {
        this[URI_JAVA_CLASS_URI_INSTANCE] = URI[URI_STATIC_METHOD_CREATE_JAVA_URI_FROM_COMPONENTS](data);
    }
    return this[URI_JAVA_CLASS_URI_INSTANCE];
};

URI.prototype[URI_METHOD_UP_DATA] = function upData(key, value) {
    this[URI_JAVA_CLASS_URI_INSTANCE] = null;
    this[URI_DATA][key] = value;
};

URI.prototype.setScheme = function(schemeStr) {
    URI[URI_METHOD_UP_DATA]("scheme", schemeStr);
};
URI.prototype.setHost = function(hostStr) {
    URI[URI_METHOD_UP_DATA]("host", hostStr);
};
URI.prototype.setPort = function(portNum) {
    URI[URI_METHOD_UP_DATA]("port", portNum);
};
URI.prototype.setPath = function(pathStr) {
    URI[URI_METHOD_UP_DATA]("path", pathStr);
};
URI.prototype.setQuery = function(queryObj) {
    URI[URI_METHOD_UP_DATA]("query", queryObj);
};
URI.prototype.setFragment = function(fragmentStr) {
    URI[URI_METHOD_UP_DATA]("fragment", fragmentStr);
};

function expect(result) {
    return {
        toBe: function(actual) {
            if (result !== actual) {
                throw new Error(`预期值${actual}，实际值${result}`);
            }
        }
    };
}

function test(desc, fn) {
    try {
        fn();
        java.log(`${desc} 测试通过`);
    } catch (error) {
        java.longToast("测试失败！");
        java.log(`${desc} 测试失败，${error}`);
    }
}

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

test("getJavaURI测试", () => {
    const uri = new URI("https://www.baidu.com");
    uri[URI_JAVA_CLASS_URI_INSTANCE] = null;
    expect(String(uri[URI_METHOD_GET_JAVA_URI]())).toBe("https://www.baidu.com?");
});

test("upData", () => {
    const uri = new URI("https://www.baidu.com");
    uri[URI_METHOD_UP_DATA]("scheme", "http");
    expect(uri[URI_JAVA_CLASS_URI_INSTANCE]).toBe(null);
    expect(String(uri[URI_METHOD_GET_JAVA_URI]().getScheme())).toBe("http");
});