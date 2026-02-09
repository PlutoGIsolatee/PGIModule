@js:
/**
 * OK
 */

const PROPERTY_DEFINER_PROPERTIES_KEY = Symbol("PropertyDefiner.properties");
const PROPERTY_DEFINER_DESCRIPTOR_KEY = Symbol("PropertyDefiner.descr");

function PropertyDefiner() {
    this[PROPERTY_DEFINER_PROPERTIES_KEY] = {};
    this[PROPERTY_DEFINER_DESCRIPTOR_KEY] = null;
}

PropertyDefiner.prototype.add = function add(key, desc = {
    configurable: false,
    enumerable: false
    /*,
        // for data:
        value: undefined,
        writable: false
        // for accessor:
        get: undefined,
        set: undefined
        */
}) {
    this[PROPERTY_DEFINER_PROPERTIES_KEY][key] = Object.assign(Object.assign({}, this[PROPERTY_DEFINER_DESCRIPTOR_KEY]), desc);
    return this;
};


PropertyDefiner.prototype.apply = function apply(desc) {
    this[PROPERTY_DEFINER_DESCRIPTOR_KEY] = desc;
    return this;
};

PropertyDefiner.prototype.unapply = function unapply() {
    this[PROPERTY_DEFINER_DESCRIPTOR_KEY] = null;
    return this;
}

PropertyDefiner.prototype.defineOn = function defineOn(object) {
    Object.defineProperties(object, this[PROPERTY_DEFINER_PROPERTIES_KEY]);
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

test("实例化测试", () => {
    new PropertyDefiner();
});

test("add测试", () => {
    const definer = new PropertyDefiner();
    definer.add("k", {
        value: "yes"
    });
});

test("defineOn基本测试", () => {
    const obj = {};
    const definer = new PropertyDefiner();
    definer.add("k", {
            value: "yes"
        })
        .defineOn(obj)

    expect(obj.k)
        .toBe("yes");
});

test("defineOn 描述符测试", () => {
    const obj = {};
    const definer = new PropertyDefiner();
    definer.add("k", {
            value: "yes",
            enumerable: true
        })
        .defineOn(obj)
    expect(JSON.parse(JSON.stringify(obj))?.k)
        .toBe("yes");
});

test("apply测试", () => {
    const obj = {};
    const definer = new PropertyDefiner();
    definer.apply({
            enumerable: true
        })
        .add("a", {
            value: 1
        })
        .add("b", {
            value: 2
        })
        .add("c", {
            value: 3,
            enumerable: false
        })
        .defineOn(obj);

    const o = JSON.parse(JSON.stringify(obj));

    expect(o.a).toBe(1);
    expect(o.b).toBe(2);
    expect(o.c).toBe(undefined);
});

test("unapply测试", () => {
    const obj = {};
    const definer = new PropertyDefiner();
    definer.apply({
            enumerable: true
        })
        .add("a", {
            value: 1
        })
        .unapply()
        .add("b", {
            value: 2
        })
        .defineOn(obj);

    const o = JSON.parse(JSON.stringify(obj));

    expect(o.a).toBe(1);
    expect(o.b).toBe(undefined);
    expect(obj.b).toBe(2);
});

test("accessor测试", () => {
    const obj = {};
    const definer = new PropertyDefiner();

    let i = 0;
    definer.apply({
            get: () => i++
        })
        .add("a", {})
        .add("b", {})
        .defineOn(obj);

    expect(obj.a).toBe(0);
    expect(obj.b).toBe(1);
});