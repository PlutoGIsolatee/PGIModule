@js:
/**
 * @todo 处理cookies headers
 * @todo 引入URL类
 */
function ConnectionClient({
    global: {
        headers = "",
        cookies = "",
    },
    default: {
        origin,
        method,
        useWebView,
        retry,
        charset,
        dnsIp,
        others = {},
    } = {},
    adapters = ConnectionClient.defaultAdapters,
}) {
    const client = Object.create(ConnectionClient.prototype);

    client.env = this;

    client.origin = origin;

    client.defaultOptions = Object.assign({
        method,
        useWebView,
        retry,
        charset,
        dnsIp,
    }, others);

    client.headers = headers;

    client.cookies = cookies;

    client.adapters = adapters;


    return client;
}

ConnectionClient.defaultAdapters = {};

ConnectionClient.defaultAdapters.connect = function connect({
    url,
    headers,
    cookies,
    options,
    env,
}) {
    const optionsStr = ", " + JSON.stringify(options);
    return String(env.java.ajax(url + optionsStr));
};

ConnectionClient.prototype.Connection = Connection;

function Connection({
    url = "",
    headers = "",
    cookies = "",
    options,
    base,
    overrideHeaders,
    overrideCookies,
}) {
    const connection = Object.create(Connection.prototype);

    if (!/[!\/]+:\/\//.test(url)) {
        connection.url = getAbsoluteUrl(base || this.origin, url);
    }

    connection.options = Object.assign({}, this.defaultOptions, options);
    
    connection.headers = overrideHeaders || (this.headers + headers);
    
    connection.cookies = overrideCookies || (this.cookies + cookies);

    return connection;
}

Connection.prototype.send


function getAbsoluteUrl(base, relative) {
    const isBaseLimited = base.endsWith("/");
    const isRelativeLimited = relative.startsWith("/");
    if (isBaseLimited) {
        base = base.slice(0, -1);
    }
    if (isRelativeLimited) {
        relative = relative.slice(1);
    }

    return base + "/" + relative;
}