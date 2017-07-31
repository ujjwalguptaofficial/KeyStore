/*! KeyStore - v1.1. - 30/7/2017
* https://github.com/ujjwalguptaofficial/KeyStore
* Copyright (c) 2017 @Ujjwal Gupta; Licensed MIT */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var KeyStore;
(function (KeyStore) {
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus["Connected"] = "connected";
        ConnectionStatus["Closed"] = "closed";
        ConnectionStatus["NotStarted"] = "not_connected";
    })(ConnectionStatus = KeyStore.ConnectionStatus || (KeyStore.ConnectionStatus = {}));
    KeyStore.Status = {
        ConStatus: ConnectionStatus.NotStarted,
        LastError: ""
    }, KeyStore.TableName = "LocalStore", KeyStore.openDb = function () {
        KeyStore.KeyStoreObj.createDb(KeyStore.TableName);
    };
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    KeyStore.init = function () {
        if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.NotStarted) {
            KeyStore.UtilityLogic.setDbType();
            KeyStore.KeyStoreObj = new KeyStore.Business.MainLogic();
            KeyStore.KeyStoreObj.createDb(KeyStore.TableName);
        }
    };
    KeyStore.get = function (key, onSuccess, onError) {
        if (onError === void 0) { onError = null; }
        if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.Connected) {
            var Query = {
                From: this.TableName,
                Where: {
                    Key: key
                }
            };
            this.KeyStoreObj.get(Query, onSuccess, onError);
        }
        else if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.NotStarted) {
            var That = this;
            setTimeout(function () {
                That.get(key, onSuccess, onError);
            }, 50);
        }
        else if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.Closed) {
            var That = this;
            this.openDb();
            setTimeout(function () {
                That.get(key, onSuccess, onError);
            }, 50);
        }
    };
    KeyStore.set = function (key, value, onSuccess, onError) {
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.Connected) {
            var Value = {
                Key: key,
                Value: value
            };
            KeyStore.KeyStoreObj.set(this.TableName, Value, onSuccess, onError);
        }
        else if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.NotStarted) {
            var That = this;
            setTimeout(function () {
                That.set(key, value, onSuccess, onError);
            }, 50);
        }
        else if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.Closed) {
            var That = this;
            this.openDb();
            setTimeout(function () {
                That.set(key, value, onSuccess, onError);
            }, 50);
        }
    };
    KeyStore.remove = function (key, onSuccess, onError) {
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.Connected) {
            var Query = {
                From: this.TableName,
                Where: {
                    Key: key
                }
            };
            this.KeyStoreObj.remove(Query, onSuccess, onError);
        }
        else if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.NotStarted) {
            var That = this;
            setTimeout(function () {
                That.remove(key, onSuccess, onError);
            }, 50);
        }
        else if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.Closed) {
            var That = this;
            this.openDb();
            setTimeout(function () {
                That.remove(key, onSuccess, onError);
            }, 50);
        }
    };
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var UtilityLogic = (function () {
        function UtilityLogic() {
        }
        UtilityLogic.setDbType = function () {
            window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            if (indexedDB) {
                window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
                window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
            }
            else {
                throw 'Your browser doesnot support IndexedDb';
            }
        };
        return UtilityLogic;
    }());
    KeyStore.UtilityLogic = UtilityLogic;
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var BaseLogic = (function () {
            function BaseLogic() {
                this.Results = null;
                this.ErrorOccured = false;
                this.ErrorCount = 0;
                this.onErrorOccured = function (e) {
                    ++this.ErrorCount;
                    if (this.ErrorCount == 1) {
                        if (this.OnError != null) {
                            this.OnError(e.target.error);
                        }
                    }
                    console.error(e);
                };
            }
            return BaseLogic;
        }());
        Business.BaseLogic = BaseLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var GetLogic = (function (_super) {
            __extends(GetLogic, _super);
            function GetLogic(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.get = function () {
                    var That = this, getData = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                That.Results = Cursor.value['Value'];
                            }
                        };
                    };
                    for (var column in this.Query.Where) {
                        getData(column, this.Query.Where[column]);
                        break;
                    }
                };
                var That = _this;
                _this.Query = query;
                _this.OnError = onError;
                _this.Transaction = Business.DbConnection.transaction([query.From], "readonly");
                _this.ObjectStore = _this.Transaction.objectStore(query.From);
                _this.Transaction.oncomplete = function (e) {
                    if (onSuccess != null) {
                        onSuccess(That.Results);
                    }
                };
                _this.get();
                return _this;
            }
            return GetLogic;
        }(Business.BaseLogic));
        Business.GetLogic = GetLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var InitDbLogic = (function () {
            function InitDbLogic(dbName, tableName) {
                var That = this, DbRequest = window.indexedDB.open(dbName, 1);
                DbRequest.onerror = function (event) {
                    console.error(event.target.error);
                };
                DbRequest.onsuccess = function (event) {
                    KeyStore.Status.ConStatus = KeyStore.ConnectionStatus.Connected;
                    Business.DbConnection = DbRequest.result;
                    Business.DbConnection.onclose = function () {
                        KeyStore.Status.ConStatus = KeyStore.ConnectionStatus.Closed;
                        KeyStore.Status.LastError = "Connection Closed";
                    };
                    Business.DbConnection.onversionchange = function (e) {
                        if (e.newVersion === null) {
                            e.target.close();
                        }
                    };
                    Business.DbConnection.onerror = function (e) {
                        KeyStore.Status.LastError = "Error occured in connection :" + e.target.result;
                    };
                    Business.DbConnection.onabort = function (e) {
                        KeyStore.Status.ConStatus = KeyStore.ConnectionStatus.Closed;
                        KeyStore.Status.LastError = "Connection aborted";
                    };
                };
                DbRequest.onupgradeneeded = function (event) {
                    var db = event.target.result, Column = "Key";
                    db.createObjectStore(tableName, {
                        keyPath: Column
                    }).createIndex(Column, Column, { unique: true });
                };
            }
            return InitDbLogic;
        }());
        Business.InitDbLogic = InitDbLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var MainLogic = (function () {
            function MainLogic() {
                this.set = function (tableName, value, onSuccess, onError) {
                    var ObjInsert = new Business.SetLogic(tableName, value, onSuccess, onError);
                };
                this.remove = function (query, onSuccess, onError) {
                    var ObjDelete = new Business.RemoveLogic(query, onSuccess, onError);
                };
                this.get = function (query, onSuccess, onError) {
                    new Business.GetLogic(query, onSuccess, onError);
                };
                this.createDb = function (tableName) {
                    var DbName = "KeyStore";
                    new Business.InitDbLogic(DbName, tableName);
                };
            }
            return MainLogic;
        }());
        Business.MainLogic = MainLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var RemoveLogic = (function (_super) {
            __extends(RemoveLogic, _super);
            function RemoveLogic(query, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.RowAffected = 0;
                _this.remove = function () {
                    var That = this, removeData = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.delete();
                                ++That.RowAffected;
                                Cursor.continue();
                            }
                        };
                    };
                    for (var Column in this.Query.Where) {
                        if (!That.ErrorOccured) {
                            removeData(Column, That.Query.Where[Column]);
                        }
                        break;
                    }
                };
                var That = _this;
                _this.Query = query;
                _this.OnError = onError;
                _this.Transaction = Business.DbConnection.transaction([query.From], "readwrite");
                _this.ObjectStore = _this.Transaction.objectStore(query.From);
                _this.Transaction.oncomplete = function () {
                    if (onSuccess != null) {
                        onSuccess(That.RowAffected);
                    }
                };
                _this.Transaction.onerror = function (e) {
                    That.onErrorOccured(e);
                };
                _this.remove();
                return _this;
            }
            return RemoveLogic;
        }(Business.BaseLogic));
        Business.RemoveLogic = RemoveLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var SetLogic = (function (_super) {
            __extends(SetLogic, _super);
            function SetLogic(tableName, value, onSuccess, onError) {
                var _this = _super.call(this) || this;
                _this.setData = function (value) {
                    var That = this, updateIfExistElseInsert = function () {
                        var CursorOpenRequest = That.ObjectStore.index('Key').openCursor(IDBKeyRange.only(value['Key']));
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.value['Value'] = value['Value'];
                                Cursor.update(Cursor.value);
                            }
                            else {
                                insertData();
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    }, insertData = function () {
                        var AddResult = That.ObjectStore.add(value);
                        AddResult.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorOccured(e);
                        };
                    };
                    updateIfExistElseInsert();
                };
                try {
                    var That = _this;
                    _this.OnError = onError;
                    _this.Transaction = Business.DbConnection.transaction([tableName], "readwrite");
                    _this.ObjectStore = _this.Transaction.objectStore(tableName);
                    _this.Transaction.oncomplete = function (e) {
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                    _this.setData(value);
                }
                catch (ex) {
                    console.error(ex);
                }
                return _this;
            }
            return SetLogic;
        }(Business.BaseLogic));
        Business.SetLogic = SetLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
//# sourceMappingURL=KeyStore.js.map