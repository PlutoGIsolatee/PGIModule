function expect(result) {
    return {
        toBe(actual) {
            if (result !== actual) {
                throw new Error(`预期值${actual}，实际值${result}`);
            }
        },
        toContain(element) {
            if (!result.includes(element)) {
                throw new Error(`预期包含${element}，实际值${result}`);
            }
        },
        toHas(key) {
            if (!Object.hasOwn(result, key)) {
                throw new Error(`预期包含${key}，实际值${result}，可枚举键${Object.keys(result)}`);
            }
        }
    };
}

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
