/**
 * OK
 */

function execute() {
    function OkhttpClient({
        followRedirects = true,
        connectTimeout = 10000,
        readTimeout = 30000,
        writeTimeout = 3000
    } = {}) {
        const ms = Packages.java.util.concurrent.TimeUnit.MILLISECONDS;

        this.javaOkhttpClient = new OkhttpClient.JavaOkhttpClient()
            .followRedirects(followRedirects)
            .connectTimeout(connectTimeout, ms)
            .readTimeout(readTimeout, ms)
            .writeTimeout(writeTimeout, ms)
            .build();
    }

    OkhttpClient.JavaOkhttpClient = Packages.okhttp3.OkhttpClient;
}