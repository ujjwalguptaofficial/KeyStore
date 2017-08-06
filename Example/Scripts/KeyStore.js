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
    KeyStore.QueryRequests = [], KeyStore.TableName = "LocalStore";
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    KeyStore.prcoessExecutionOfCode = function (request) {
        KeyStore.QueryRequests.push(request);
        if (KeyStore.QueryRequests.length == 1) {
            KeyStore.executeCode();
        }
    };
    KeyStore.executeCode = function () {
        if (KeyStore.QueryRequests.length > 0) {
            var Request = {
                Name: KeyStore.QueryRequests[0].Name,
                Query: KeyStore.QueryRequests[0].Query
            };
            KeyStore.executeCodeDirect(KeyStore.QueryRequests[0]);
        }
    };
    KeyStore.executeCodeDirect = function (request) {
        var That = this;
        new KeyStore.Business.Main(function (results) {
            That.processFinishedRequest(results);
        }).checkConnectionAndExecuteLogic(request);
    };
    KeyStore.processFinishedRequest = function (message) {
        var FinishedRequest = this.QueryRequests.shift();
        if (message.ErrorOccured) {
            if (FinishedRequest.OnError) {
                FinishedRequest.OnError(message.ErrorDetails);
            }
            else {
                console.log(message.ErrorDetails);
            }
        }
        else {
            if (FinishedRequest.OnSuccess) {
                if (message.ReturnedValue) {
                    FinishedRequest.OnSuccess(message.ReturnedValue);
                }
                else {
                    FinishedRequest.OnSuccess();
                }
            }
        }
        this.executeCode();
    };
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.setDbType = function () {
            window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            if (indexedDB) {
                window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
                window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
            }
            else {
                throw 'Your browser doesnot support IndexedDb';
            }
        };
        return Utils;
    }());
    KeyStore.Utils = Utils;
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Base = (function () {
            function Base() {
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
            return Base;
        }());
        Business.Base = Base;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Get = (function (_super) {
            __extends(Get, _super);
            function Get(query, onSuccess, onError) {
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
            return Get;
        }(Business.Base));
        Business.Get = Get;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Set = (function (_super) {
            __extends(Set, _super);
            function Set(query, onSuccess, onError) {
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
                    _this.Transaction = Business.DbConnection.transaction([query.TableName], "readwrite");
                    _this.ObjectStore = _this.Transaction.objectStore(query.TableName);
                    _this.Transaction.oncomplete = function (e) {
                        if (onSuccess != null) {
                            onSuccess();
                        }
                    };
                    _this.setData(query.Set);
                }
                catch (ex) {
                    console.error(ex);
                }
                return _this;
            }
            return Set;
        }(Business.Base));
        Business.Set = Set;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var Remove = (function (_super) {
            __extends(Remove, _super);
            function Remove(query, onSuccess, onError) {
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
            return Remove;
        }(Business.Base));
        Business.Remove = Remove;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var InitDb = (function () {
            function InitDb(dbName, tableName, onSuccess, onError) {
                var That = this, DbRequest = window.indexedDB.open(dbName, 1);
                DbRequest.onerror = function (event) {
                    if (onError != null) {
                        onError(event.target.error);
                    }
                };
                DbRequest.onsuccess = function (event) {
                    Business.Status.ConStatus = KeyStore.ConnectionStatus.Connected;
                    Business.DbConnection = DbRequest.result;
                    Business.DbConnection.onclose = function () {
                        Business.Status.ConStatus = KeyStore.ConnectionStatus.Closed;
                        Business.Status.LastError = "Connection Closed";
                    };
                    Business.DbConnection.onversionchange = function (e) {
                        if (e.newVersion === null) {
                            e.target.close();
                        }
                    };
                    Business.DbConnection.onerror = function (e) {
                        Business.Status.LastError = "Error occured in connection :" + e.target.result;
                    };
                    Business.DbConnection.onabort = function (e) {
                        Business.Status.ConStatus = KeyStore.ConnectionStatus.Closed;
                        Business.Status.LastError = "Connection aborted";
                    };
                    if (onSuccess != null) {
                        onSuccess();
                    }
                };
                DbRequest.onupgradeneeded = function (event) {
                    var db = event.target.result, Column = "Key";
                    db.createObjectStore(tableName, {
                        keyPath: Column
                    }).createIndex(Column, Column, { unique: true });
                };
            }
            return InitDb;
        }());
        Business.InitDb = InitDb;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        Business.Status = {
            ConStatus: KeyStore.ConnectionStatus.NotStarted,
            LastError: ""
        };
        var Main = (function () {
            function Main(onSuccess) {
                if (onSuccess === void 0) { onSuccess = null; }
                this.checkConnectionAndExecuteLogic = function (request) {
                    if (request.Name == 'create_db' || request.Name == 'open_db') {
                        this.executeLogic(request);
                    }
                    else {
                        if (Business.Status.ConStatus == KeyStore.ConnectionStatus.Connected) {
                            this.executeLogic(request);
                        }
                        else if (Business.Status.ConStatus == KeyStore.ConnectionStatus.NotStarted) {
                            var That = this;
                            setTimeout(function () {
                                That.checkConnectionAndExecuteLogic(request);
                            }, 50);
                        }
                        else if (Business.Status.ConStatus == KeyStore.ConnectionStatus.Closed) {
                            var That = this;
                            this.createDb(KeyStore.TableName);
                            setTimeout(function () {
                                That.checkConnectionAndExecuteLogic(request);
                            }, 50);
                        }
                    }
                };
                this.returnResult = function (result) {
                    if (this.OnSuccess) {
                        this.OnSuccess(result);
                    }
                    else {
                        self.postMessage(result);
                    }
                };
                this.executeLogic = function (request) {
                    var That = this, OnSuccess = function (results) {
                        That.returnResult({
                            ReturnedValue: results
                        });
                    }, OnError = function (err) {
                        That.returnResult({
                            ErrorOccured: true,
                            ErrorDetails: err
                        });
                    };
                    switch (request.Name) {
                        case 'get':
                            this.get(request.Query, OnSuccess, OnError);
                            break;
                        case 'set':
                            this.set(request.Query, OnSuccess, OnError);
                            break;
                        case 'remove':
                            this.remove(request.Query, OnSuccess, OnError);
                            break;
                        case 'create_db':
                            this.createDb(request.Query, OnSuccess, OnError);
                            break;
                    }
                };
                this.set = function (query, onSuccess, onError) {
                    var ObjInsert = new Business.Set(query, onSuccess, onError);
                };
                this.remove = function (query, onSuccess, onError) {
                    var ObjDelete = new Business.Remove(query, onSuccess, onError);
                };
                this.get = function (query, onSuccess, onError) {
                    new Business.Get(query, onSuccess, onError);
                };
                this.createDb = function (tableName, onSuccess, onError) {
                    var DbName = "KeyStore";
                    new Business.InitDb(DbName, tableName, onSuccess, onError);
                };
                this.OnSuccess = onSuccess;
            }
            return Main;
        }());
        Business.Main = Main;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    KeyStore.init = function () {
        KeyStore.Utils.setDbType();
        KeyStore.prcoessExecutionOfCode({
            Name: 'create_db',
        });
    };
    KeyStore.get = function (key, onSuccess, onError) {
        if (onError === void 0) { onError = null; }
        var Query = {
            From: this.TableName,
            Where: {
                Key: key
            }
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'get',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
    };
    KeyStore.set = function (key, value, onSuccess, onError) {
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        var Query = {
            TableName: this.TableName,
            Set: {
                Key: key,
                Value: value
            }
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'set',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
    };
    KeyStore.remove = function (key, onSuccess, onError) {
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        var Query = {
            From: this.TableName,
            Where: {
                Key: key
            }
        };
        KeyStore.prcoessExecutionOfCode({
            Name: 'remove',
            Query: Query,
            OnSuccess: onSuccess,
            OnError: onError
        });
    };
})(KeyStore || (KeyStore = {}));
KeyStore.init();
//# sourceMappingURL=KeyStore.js.map