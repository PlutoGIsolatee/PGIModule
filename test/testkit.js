function expect(result) {
    return new Asserts(result);
}

function Asserts(src) {
    this.src = src;
}

Asserts.prototype.log = function log(java) {
    java.log(this.src);
    return this;
};

Asserts.prototype.toBe = function toBe(expected) {
    const result = this.src;
    if (result !== expected) {
        throw new Error(`预期值${expected}，实际值${result}`);
    }
    return this;
};

Asserts.prototype.toContain = function toContain(element) {
    const result = this.src;
    if (!result.includes(element)) {
        throw new Error(`预期包含${element}，实际值${result}`);
    }
    return this;
};

Asserts.prototype.toNotContain = function toNotContain(element) {
    const result = this.src;
    if (result.includes(element)) {
        throw new Error(`预期不包含${element}，实际值${result}`);
    }
    return this;
};

Asserts.prototype.toHas = function toHas(key) {
    const result = this.src;
    if (!Object.hasOwn(result, key)) {
        throw new Error(`预期包含${key}，实际值${result}，可枚举键${Object.keys(result)}`);
    }
    return this;
};

Asserts.prototype.toNotHas = function toNotHas(key) {
    const result = this.src;
    if (Object.hasOwn(result, key)) {
        throw new Error(`预期不包含${key}，实际值${result}，可枚举键${Object.keys(result)}`);
    }
    return this;
};

Asserts.prototype.toThrow = function toThrow(name) {
    const fun = this.src;
    let err;
    try {
        fun();
    } catch (e) {
        err = e;
    }
    if (!err) {
        throw new Error(`预期抛出${name} Error，实际未抛出错误`);
    } else if (err.name !== name) {
        throw new Error(`预期抛出${name} Error，实际抛出${err}`);
    }
    return this;
};


function test(desc, fn) {
    const {
        java
    } = this;
    try {
        fn();
        java.log(`${desc} 测试通过`);
    } catch (error) {
        java.longToast("测试失败！");
        java.log(`${desc} 测试失败，${error}`);
    }
}