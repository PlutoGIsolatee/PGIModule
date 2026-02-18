/**
 * 不是AbstractMap封装;
 * 是Map封装的Abstract;
 * 或者说Map interface的封装
 */
class AbstractMap {
    getJavaMapInstance() {
        throw new Error("子类必须实现getJavaMapInstance方法");
    }

    #getJavaIterator() {
        return this.getJavaMapInstance().entrySet().iterator();
    }

    *[Symbol.iterator]() {
        const iterator = this.getJavaIterator();
        while (iterator.hasNext()) {
            const entry = iterator.next();
            yield [entry.getKey(), entry.getValue()];
        }
    }

    entries() {
        return this[Symbol.iterator]();
    }


    * keys() {
        for (const [key] of this) {
            yield key;
        }
    }

    * values() {
        for (const [, value] of this) {
            yield value;
        }
    }


    containsKey(key) {
        return Boolean(this.getJavaMapInstance().containsKey(key));
    }

    containsValue(value) {
        return Boolean(this.getJavaMapInstance().containsValue(value));
    }

    isEmpty() {
        return Boolean(this.getJavaMapInstance().isEmpty());
    }

    size() {
        return Number(this.getJavaMapInstance().size());
    }

    toString() {
        return String(this.getJavaMapInstance().toString());
    }

    put(key, value) {
        this.getJavaMapInstance().put(key, value);
    }

    putAll(map) {
        this.getJavaMapInstance().putAll(map);
    }

    get(key) {
        return this.getJavaMapInstance().get(key);
    }

    remove(key) {
        this.getJavaMapInstance().remove(key);
    }

    clear() {
        this.getJavaMapInstance().clear();
    }
}


test("抽象方法约束测试", () => {
    const map = new AbstractMap();

    expect(() => {
            map.getJavaMapInstance();
        })
        .toThrow();
    expect(() => {
            map.put();
        })
        .toThrow();
});