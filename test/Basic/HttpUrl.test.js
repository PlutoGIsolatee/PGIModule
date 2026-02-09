@js:
/**
 * OK
 */

const HTTP_URL_INSTANCE_KEY = Symbol("HttpUrl.instance");
const HTTP_URL_BUILDER_KEY = Symbol("HttpUrl.builder");

function HttpUrl({
    scheme = "http",
    host = "",
    path = "",
    query = {}
}) {
    const builder = new HttpUrl.JavaHttpUrl.Builder()
        .scheme(scheme)
        .addPathSegment(path);

    if (host) {
        builder.host(host);
    }

    Object.entries(query).forEach(([key, value]) => {
        builder.addQueryParameter(key, value);
    });

    this[HTTP_URL_BUILDER_KEY] = builder;
}

HttpUrl.prototype.getJavaHttpUrl = function() {
    if (!this[HTTP_URL_INSTANCE_KEY]) {
        this[HTTP_URL_INSTANCE_KEY] = this[HTTP_URL_BUILDER_KEY].build();
    }
    return this[HTTP_URL_INSTANCE_KEY];
};

HttpUrl.prototype.getJavaBuilder = function() {
    if (!this[HTTP_URL_BUILDER_KEY]) {
        this[HTTP_URL_BUILDER_KEY] = this[HTTP_URL_INSTANCE_KEY].newBuilder();
    }
    return this[HTTP_URL_BUILDER_KEY];
}

HttpUrl.prototype.setScheme = function(scheme) {
    this[HTTP_URL_BUILDER_KEY].scheme(scheme);
    this[HTTP_URL_INSTANCE_KEY] = null;
};

HttpUrl.prototype.setHost = function(host) {
    this[HTTP_URL_BUILDER_KEY].host(host);
    this[HTTP_URL_INSTANCE_KEY] = null;
};

HttpUrl.JavaHttpUrl = Packages.okhttp3.HttpUrl;

HttpUrl.parse = function parse(httpUrlStr) {
    const httpUrl = Object.create(HttpUrl.prototype);

    const javaInstance = HttpUrl.JavaHttpUrl.parse(httpUrlStr);

    httpUrl[HTTP_URL_INSTANCE_KEY] = javaInstance;

    return httpUrl;
}


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
        java.log(`${desc} 测试失败，${error}`);
    }
}

test("测试创建", () => {
    new HttpUrl({

    });
});

test("测试方法", () => {
    (new HttpUrl({

    }))
});