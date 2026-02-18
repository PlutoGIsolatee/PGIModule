@js:"use strict";
eval(String(source.bookSourceComment));

var _AbstractMap_brand = /*#__PURE__*/new WeakSet();
/**
 * 不是AbstractMap封装;
 * 是Map封装的Abstract;
 * 或者说Map interface的封装
 */
var AbstractMap = /*#__PURE__*/function () {
  function AbstractMap() {
    _classCallCheck(this, AbstractMap);
    _classPrivateMethodInitSpec(this, _AbstractMap_brand);
  }
  return _createClass(AbstractMap, [{
    key: "getJavaMapInstance",
    value: function getJavaMapInstance() {
      throw new Error("子类必须实现getJavaMapInstance方法");
    }
  }, {
    key: Symbol.iterator,
    value: /*#__PURE__*/_regenerator().m(function value() {
      var iterator, entry;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            iterator = this.getJavaIterator();
          case 1:
            if (!iterator.hasNext()) {
              _context.n = 3;
              break;
            }
            entry = iterator.next();
            _context.n = 2;
            return [entry.getKey(), entry.getValue()];
          case 2:
            _context.n = 1;
            break;
          case 3:
            return _context.a(2);
        }
      }, value, this);
    })
  }, {
    key: "entries",
    value: function entries() {
      return this[Symbol.iterator]();
    }
  }, {
    key: "keys",
    value: /*#__PURE__*/_regenerator().m(function keys() {
      var _iterator, _step, _step$value, key, _t;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _iterator = _createForOfIteratorHelper(this);
            _context2.p = 1;
            _iterator.s();
          case 2:
            if ((_step = _iterator.n()).done) {
              _context2.n = 4;
              break;
            }
            _step$value = _slicedToArray(_step.value, 1), key = _step$value[0];
            _context2.n = 3;
            return key;
          case 3:
            _context2.n = 2;
            break;
          case 4:
            _context2.n = 6;
            break;
          case 5:
            _context2.p = 5;
            _t = _context2.v;
            _iterator.e(_t);
          case 6:
            _context2.p = 6;
            _iterator.f();
            return _context2.f(6);
          case 7:
            return _context2.a(2);
        }
      }, keys, this, [[1, 5, 6, 7]]);
    })
  }, {
    key: "values",
    value: /*#__PURE__*/_regenerator().m(function values() {
      var _iterator2, _step2, _step2$value, value, _t2;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _iterator2 = _createForOfIteratorHelper(this);
            _context3.p = 1;
            _iterator2.s();
          case 2:
            if ((_step2 = _iterator2.n()).done) {
              _context3.n = 4;
              break;
            }
            _step2$value = _slicedToArray(_step2.value, 2), value = _step2$value[1];
            _context3.n = 3;
            return value;
          case 3:
            _context3.n = 2;
            break;
          case 4:
            _context3.n = 6;
            break;
          case 5:
            _context3.p = 5;
            _t2 = _context3.v;
            _iterator2.e(_t2);
          case 6:
            _context3.p = 6;
            _iterator2.f();
            return _context3.f(6);
          case 7:
            return _context3.a(2);
        }
      }, values, this, [[1, 5, 6, 7]]);
    })
  }, {
    key: "containsKey",
    value: function containsKey(key) {
      return Boolean(this.getJavaMapInstance().containsKey(key));
    }
  }, {
    key: "containsValue",
    value: function containsValue(value) {
      return Boolean(this.getJavaMapInstance().containsValue(value));
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return Boolean(this.getJavaMapInstance().isEmpty());
    }
  }, {
    key: "size",
    value: function size() {
      return Number(this.getJavaMapInstance().size());
    }
  }, {
    key: "toString",
    value: function toString() {
      return String(this.getJavaMapInstance().toString());
    }
  }, {
    key: "put",
    value: function put(key, value) {
      this.getJavaMapInstance().put(key, value);
    }
  }, {
    key: "putAll",
    value: function putAll(map) {
      this.getJavaMapInstance().putAll(map);
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.getJavaMapInstance().get(key);
    }
  }, {
    key: "remove",
    value: function remove(key) {
      this.getJavaMapInstance().remove(key);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.getJavaMapInstance().clear();
    }
  }]);
}();
function _getJavaIterator() {
  return this.getJavaMapInstance().entrySet().iterator();
}
test("抽象方法约束测试", function () {
  var map = new AbstractMap();
  expect(function () {
    map.getJavaMapInstance();
  }).toThrow();
  expect(function () {
    map.put();
  }).toThrow();
});
