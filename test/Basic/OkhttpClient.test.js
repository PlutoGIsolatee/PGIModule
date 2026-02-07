@js:
/**
 * OK
 */

const OKHTTP_CLIENT_INSTANCE = Symbol("OkHttpClient.instance");

function OkHttpClient({
    followRedirects = true,
    retryOnConnectionFailure = true,
    connectTimeout = 10,
    readTimeout = 30,
    writeTimeout = 30
} = {}) {
    const s = Packages.java.util.concurrent.TimeUnit.SECONDS;

    let builder;

    if (!this.OKHTTP_CLIENT_INSTANCE) {
        builder = new OkHttpClient.JavaOkHttpClient.Builder();
    } else {
        builder = this.OKHTTP_CLIENT_INSTANCE
            .newBuilder();
    }

    this.javaOkHttpClient = builder
        .followRedirects(followRedirects)
        .retryOnConnectionFailure(retryOnConnectionFailure)
        .connectTimeout(connectTimeout, s)
        .readTimeout(readTimeout, s)
        .writeTimeout(writeTimeout, s)
        .build();
}

OkHttpClient.JavaOkHttpClient = Packages.okhttp3.OkHttpClient;




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
    new OkHttpClient();
});

test("测试方法", () => {
    (new OkHttpClient())
});