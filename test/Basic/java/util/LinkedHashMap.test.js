@js:
const LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP = Symbol("LinkedHashMap.JavaClassLinkedHashMap");
const LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP_INSTANCE = Symbol("LinkedHashMap.prototype.javaClassLinkedHashMapInstance");

function LinkedHashMap(literal = []) {
    const map = new LinkedHashMap[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP]();
    literal.forEach(([key, value]) => {
        map.put(key, value);
    });
    this[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP_INSTANCE] = map;
}

LinkedHashMap[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP] = Packages.java.util.LinkedHashMap;

LinkedHashMap.prototype

LinkedHashMap.prototype.get = function(key) {
    return this[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP_INSTANCE].get(key);
};

LinkedHashMap.prototype.put = function(key, value) {
    return this[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP_INSTANCE].put(key, value);
};

LinkedHashMap.prototype.remove = function(key) {
    return this[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP_INSTANCE].remove(key);
};

LinkedHashMap.prototype.isEmpty = function() {
    return this[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP_INSTANCE].isEmpty();
};

LinkedHashMap.prototype.size = function() {
    return this[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP_INSTANCE].size();
};

LinkedHashMap.prototype.clear = function() {
    return this[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP_INSTANCE].clear();
};

LinkedHashMap.prototype.putAll = function(otherMap) {
    return this[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP_INSTANCE].putAll(otherMap.map);
};

LinkedHashMap[Symbol.iterator] = function*() {
    const iterator = this[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP_INSTANCE].entrySet().iterator();
    while (iterator.hasNext()) {
        const entry = iterator.next();
        yield [entry.getKey(), entry.getValue()];
    }
};

LinkedHashMap.prototype.toString = function() {
    return this[LINKED_HASH_MAP_JAVA_CLASS_LINKED_HASH_MAP_INSTANCE].toString();
};

LinkedHashMap.prototype.toArray = function() {
    return Array.from(this);
};

LinkedHashMap.prototype.toObject = function() {
    const obj = {};
    this.toArray().forEach(([key, value]) => {
        obj[key] = value;
    });
    return obj;
};

LinkedHashMap.prototype.toJSON = function() {
    return JSON.stringify(this.toArray());
};