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
    var ErrorType;
    (function (ErrorType) {
        ErrorType[ErrorType["UndefinedColumn"] = 0] = "UndefinedColumn";
        ErrorType[ErrorType["UndefinedValue"] = 1] = "UndefinedValue";
        ErrorType[ErrorType["UndefinedColumnName"] = 2] = "UndefinedColumnName";
        ErrorType[ErrorType["UndefinedColumnValue"] = 3] = "UndefinedColumnValue";
        ErrorType[ErrorType["NotArray"] = 4] = "NotArray";
        ErrorType[ErrorType["NoValueSupplied"] = 5] = "NoValueSupplied";
        ErrorType[ErrorType["ColumnNotExist"] = 6] = "ColumnNotExist";
        ErrorType[ErrorType["InvalidOp"] = 7] = "InvalidOp";
        ErrorType[ErrorType["NullValue"] = 8] = "NullValue";
        ErrorType[ErrorType["BadDataType"] = 9] = "BadDataType";
        ErrorType[ErrorType["NextJoinNotExist"] = 10] = "NextJoinNotExist";
        ErrorType[ErrorType["TableNotExist"] = 11] = "TableNotExist";
    })(ErrorType = KeyStore.ErrorType || (KeyStore.ErrorType = {}));
    var ConnectionStatus;
    (function (ConnectionStatus) {
        ConnectionStatus[ConnectionStatus["Connected"] = 1] = "Connected";
        ConnectionStatus[ConnectionStatus["Closed"] = 2] = "Closed";
        ConnectionStatus[ConnectionStatus["NotStarted"] = 3] = "NotStarted";
    })(ConnectionStatus = KeyStore.ConnectionStatus || (KeyStore.ConnectionStatus = {}));
    KeyStore.Status = {
        ConStatus: ConnectionStatus.NotStarted,
        LastError: ""
    };
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var UtilityLogic = (function () {
        function UtilityLogic() {
        }
        UtilityLogic.getError = function (errorType, logError, errorDetail) {
            if (logError === void 0) { logError = false; }
            var Error = {
                Name: KeyStore.ErrorType[errorType],
                Value: ''
            };
            switch (errorType) {
                case KeyStore.ErrorType.NotArray:
                    Error.Value = "Supplied value is not an array";
                    break;
                case KeyStore.ErrorType.UndefinedColumn:
                    Error.Value = "Column is undefined in Where";
                    break;
                case KeyStore.ErrorType.UndefinedValue:
                    Error.Value = "Value is undefined in Where";
                    break;
                case KeyStore.ErrorType.UndefinedColumnName:
                    Error.Value = "Column name is undefined";
                    break;
                case KeyStore.ErrorType.UndefinedColumnValue:
                    Error.Value = "Column value is undefined";
                    break;
                case KeyStore.ErrorType.NoValueSupplied:
                    Error.Value = "No value supplied";
                    break;
                case KeyStore.ErrorType.InvalidOp:
                    Error.Value = "Invalid Op Value '" + errorDetail['Op'] + "'";
                    break;
                case KeyStore.ErrorType.ColumnNotExist:
                    Error.Value = "Column '" + errorDetail['ColumnName'] + "' does not exist";
                    break;
                case KeyStore.ErrorType.NullValue:
                    Error.Value = "Null value is not allowed for column '" + errorDetail['ColumnName'] + "'";
                    break;
                case KeyStore.ErrorType.BadDataType:
                    Error.Value = "Supplied value for column '" + errorDetail['ColumnName'] + "' does not have valid type";
                    break;
                case KeyStore.ErrorType.NextJoinNotExist:
                    Error.Value = "Next join details not supplied";
                    break;
                case KeyStore.ErrorType.TableNotExist:
                    Error.Value = "Table '" + errorDetail['TableName'] + "' does not exist";
                    ;
                    break;
                default: console.warn('the error type is not defined');
            }
            if (logError) {
                console.warn("JsStorage Error :- " + Error.Value);
            }
            return Error;
        };
        UtilityLogic.convertObjectintoLowerCase = function (obj) {
            var keys = Object.keys(obj);
            var n = keys.length;
            while (n--) {
                var key = keys[n];
                obj[key.toLowerCase()] = obj[key];
                delete obj[key];
            }
        };
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
    var Model;
    (function (Model) {
        var Column = (function () {
            function Column(key, tableName) {
                if (key.Name != null) {
                    this.Name = key.Name;
                }
                else {
                    throw "Column Name is not defined for table:" + tableName;
                }
                this.AutoIncrement = key.AutoIncrement != null ? key.AutoIncrement : false;
                this.PrimaryKey = key.PrimaryKey != null ? key.PrimaryKey : false;
                this.Unique = key.Unique != null ? key.Unique : false;
                this.CurrentDate = key.CurrentDate != null ? key.CurrentDate : false;
                this.NotNull = key.NotNull != null ? key.NotNull : false;
                this.DataType = key.DataType != null ? key.DataType : '';
            }
            return Column;
        }());
        Model.Column = Column;
    })(Model = KeyStore.Model || (KeyStore.Model = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Model;
    (function (Model) {
        var Table = (function () {
            function Table(table, dbName) {
                this.Name = "";
                this.Columns = [];
                this.RequireDelete = false;
                this.RequireCreation = false;
                this.PrimaryKey = "";
                this.Name = table.Name;
                this.Version = table.Version == undefined ? 1 : table.Version;
                var That = this;
                table.Columns.forEach(function (item) {
                    That.Columns.push(new Model.Column(item, table.Name));
                });
                this.setRequireDelete(dbName);
                this.setPrimaryKey();
            }
            Table.prototype.setPrimaryKey = function () {
                var That = this, Length = this.Columns.length;
                this.Columns.forEach(function (item, index) {
                    if (item.PrimaryKey && That.PrimaryKey.length == 0) {
                        That.PrimaryKey = item.Name;
                    }
                });
            };
            Table.prototype.setRequireDelete = function (dbName) {
                this.RequireDelete = true;
            };
            return Table;
        }());
        Model.Table = Table;
    })(Model = KeyStore.Model || (KeyStore.Model = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Model;
    (function (Model) {
        var DataBase = (function () {
            function DataBase(dataBase) {
                this.Tables = [];
                var That = this;
                this.Name = dataBase.Name;
                dataBase.Tables.forEach(function (item) {
                    That.Tables.push(new Model.Table(item, That.Name));
                });
            }
            return DataBase;
        }());
        Model.DataBase = DataBase;
    })(Model = KeyStore.Model || (KeyStore.Model = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var CreateDbLogic = (function () {
            function CreateDbLogic() {
                var That = this, DbRequest = window.indexedDB.open(Business.ActiveDataBase.Name, Business.DbVersion);
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
                    var db = event.target.result;
                    Business.ActiveDataBase.Tables.forEach(function (item) {
                        if (item.RequireDelete) {
                            if (db.objectStoreNames.contains(item.Name)) {
                                db.deleteObjectStore(item.Name);
                            }
                            createObjectStore(db, item);
                        }
                        else if (item.RequireCreation) {
                            createObjectStore(db, item);
                        }
                    });
                };
                var createObjectStore = function (dbConnection, item) {
                    try {
                        if (item.PrimaryKey.length > 0) {
                            var Store = dbConnection.createObjectStore(item.Name, {
                                keyPath: item.PrimaryKey
                            });
                            item.Columns.forEach(function (column) {
                                if (column.PrimaryKey) {
                                    Store.createIndex(column.Name, column.Name, { unique: true });
                                }
                                else {
                                    Store.createIndex(column.Name, column.Name, { unique: false });
                                }
                            });
                        }
                        else {
                            var Store = dbConnection.createObjectStore(item.Name, {
                                autoIncrement: true
                            });
                            item.Columns.forEach(function (column) {
                                if (column.Unique) {
                                    Store.createIndex(column.Name, column.Name, { unique: true });
                                }
                                else {
                                    Store.createIndex(column.Name, column.Name, { unique: false });
                                }
                            });
                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                };
            }
            return CreateDbLogic;
        }());
        Business.CreateDbLogic = CreateDbLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var RemoveLogic = (function () {
            function RemoveLogic(query, onSuccess, onError) {
                var That = this, Transaction = Business.DbConnection.transaction([query.From], "readwrite"), ObjectStore = Transaction.objectStore(query.From), ErrorOccured = false, ErrorCount = 0, RowAffected = 0, onErrorGetRequest = function (e) {
                    ++ErrorCount;
                    if (onError != null && this.ErrorCount == 1) {
                        onError(e.target.error);
                    }
                    console.error(e);
                };
                Transaction.oncomplete = function () {
                    if (onSuccess != null) {
                        onSuccess(RowAffected);
                    }
                };
                Transaction.onerror = onErrorGetRequest;
                var Column, ExecutionNo = 0, ConditionLength = Object.keys(query.Where).length;
                for (Column in query.Where) {
                    if (!ErrorOccured) {
                        var CursorOpenRequest = ObjectStore.index(Column).openCursor(IDBKeyRange.only(query.Where[Column])), ExecutionNo = 0;
                        CursorOpenRequest.onerror = function (e) {
                            ErrorOccured = true;
                            onErrorGetRequest(e);
                        };
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Cursor.delete();
                                ++RowAffected;
                                Cursor.continue();
                            }
                        };
                    }
                    else {
                        return;
                    }
                }
            }
            return RemoveLogic;
        }());
        Business.RemoveLogic = RemoveLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var SetLogic = (function () {
            function SetLogic(tableName, value, isReturn, onSuccess, onError) {
                this.ErrorOccured = false;
                this.ErrorCount = 0;
                this.onErrorRequest = function (e, customError) {
                    if (customError === void 0) { customError = false; }
                    ++this.ErrorCount;
                    if (this.ErrorCount == 1) {
                        if (this.OnError != null) {
                            if (!customError) {
                                this.OnError(e.target.error, this.TotalRowsAffected);
                            }
                            else {
                                this.OnError(e, this.TotalRowsAffected);
                            }
                        }
                    }
                    console.error(e);
                };
                try {
                    this.OnSuccess = onSuccess;
                    this.OnError = onError;
                    var That = this, Updated = false;
                    var UpdateIfExist = function () {
                        var Transaction = Business.DbConnection.transaction([tableName], "readwrite");
                        That.Store = Transaction.objectStore(tableName);
                        Transaction.oncomplete = function (e) {
                            if (Updated) {
                                if (onSuccess != null) {
                                    onSuccess();
                                }
                            }
                            else {
                                SetData();
                            }
                        };
                        var CursorOpenRequest = That.Store.index('Key').openCursor(IDBKeyRange.only(value['Key']));
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                Updated = true;
                                Cursor.value['Value'] = value['Value'];
                                Cursor.update(Cursor.value);
                            }
                        };
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorRequest(e);
                        };
                    };
                    var SetData = function () {
                        var Transaction = Business.DbConnection.transaction([tableName], "readwrite");
                        That.Store = Transaction.objectStore(tableName);
                        Transaction.oncomplete = function (e) {
                            if (onSuccess != null) {
                                onSuccess();
                            }
                        };
                        var AddResult = That.Store.add(value);
                        AddResult.onerror = function (e) {
                            That.onErrorRequest(e);
                        };
                    };
                    UpdateIfExist();
                }
                catch (ex) {
                    console.error(ex);
                }
            }
            return SetLogic;
        }());
        Business.SetLogic = SetLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var OpenDbLogic = (function () {
            function OpenDbLogic(objMain, onSuccess, onError) {
                if (KeyStore.Status.ConStatus != KeyStore.ConnectionStatus.Connected) {
                    if (Business.ActiveDataBase.Name.length > 0) {
                        var DbRequest = window.indexedDB.open(Business.ActiveDataBase.Name, Business.DbVersion), That = this;
                        DbRequest.onerror = function (event) {
                            if (onError != null) {
                                onError(event.target.error);
                            }
                        };
                        DbRequest.onsuccess = function (event) {
                            KeyStore.Status.ConStatus = KeyStore.ConnectionStatus.Connected;
                            Business.DbConnection = DbRequest.result;
                            Business.DbConnection.onclose = function () {
                                KeyStore.Status.ConStatus = KeyStore.ConnectionStatus.Closed;
                                KeyStore.Status.LastError = "Connection Closed, trying to reconnect";
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
                                KeyStore.Status.LastError = "Connection Aborted";
                            };
                            if (onSuccess != null) {
                                onSuccess(objMain);
                            }
                        };
                    }
                    else {
                        if (onError != null) {
                            onError({
                                Name: "DbNotFound",
                                Value: "DataBase name is not found, please first initiate the db using createDb"
                            });
                        }
                    }
                }
                else {
                    if (onSuccess != null) {
                        onSuccess();
                    }
                }
            }
            return OpenDbLogic;
        }());
        Business.OpenDbLogic = OpenDbLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        var BaseGetLogic = (function () {
            function BaseGetLogic() {
                this.ErrorOccured = false;
                this.ErrorCount = 0;
                this.onErrorRequest = function (e) {
                    ++this.ErrorCount;
                    if (this.ErrorCount == 1) {
                        if (this.OnError != null) {
                            this.OnError(e.target.error);
                        }
                    }
                    console.error(e);
                };
            }
            return BaseGetLogic;
        }());
        Business.BaseGetLogic = BaseGetLogic;
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
                _this.executeWhereLogic = function () {
                    var Column, That = this;
                    var executeInnerWhereLogic = function (column, value) {
                        var CursorOpenRequest = That.ObjectStore.index(column).openCursor(IDBKeyRange.only(value));
                        CursorOpenRequest.onerror = function (e) {
                            That.ErrorOccured = true;
                            That.onErrorRequest(e);
                        };
                        CursorOpenRequest.onsuccess = function (e) {
                            var Cursor = e.target.result;
                            if (Cursor) {
                                That.Results = Cursor.value['Value'];
                            }
                        };
                    };
                    for (Column in this.Query.Where) {
                        executeInnerWhereLogic(Column, this.Query.Where[Column]);
                        break;
                    }
                };
                var That = _this;
                _this.Query = query;
                _this.OnSuccess = onSuccess;
                _this.OnError = onError;
                _this.Transaction = Business.DbConnection.transaction([query.From], "readonly");
                _this.Transaction.oncomplete = function (e) {
                    if (onSuccess != null) {
                        onSuccess(That.Results);
                    }
                };
                _this.ObjectStore = _this.Transaction.objectStore(query.From);
                _this.executeWhereLogic();
                return _this;
            }
            return GetLogic;
        }(Business.BaseGetLogic));
        Business.GetLogic = GetLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var KeyStore;
(function (KeyStore) {
    var Business;
    (function (Business) {
        Business.DbVersion = 1;
        var MainLogic = (function () {
            function MainLogic(dataBase) {
                this.openDb = function (objMain, onSuccess, onError) {
                    var ObjOpenDb = new Business.OpenDbLogic(objMain, onSuccess, onError);
                };
                this.closeDb = function () {
                    if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.Connected) {
                        Business.DbConnection.close();
                    }
                };
                this.set = function (tableName, value, isReturn, onSuccess, onError) {
                    var ObjInsert = new Business.SetLogic(tableName, value, isReturn, onSuccess, onError);
                };
                this.remove = function (query, onSuccess, onError) {
                    var ObjDelete = new Business.RemoveLogic(query, onSuccess, onError);
                };
                this.get = function (query, onSuccess, onError) {
                    new Business.GetLogic(query, onSuccess, onError);
                };
                this.createDb = function () {
                    new Business.CreateDbLogic();
                };
                Business.ActiveDataBase = dataBase;
            }
            return MainLogic;
        }());
        Business.MainLogic = MainLogic;
    })(Business = KeyStore.Business || (KeyStore.Business = {}));
})(KeyStore || (KeyStore = {}));
var Model = KeyStore.Model;
var DataBase = Model.DataBase;
var Column = Model.Column;
var Table = Model.Table;
var KeyStore;
(function (KeyStore) {
    var Instance = (function () {
        function Instance() {
            this.TableName = "LocalStore";
            if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.NotStarted) {
                KeyStore.UtilityLogic.setDbType();
                var Table = {
                    Name: this.TableName,
                    Columns: [{
                            Name: "Key",
                            PrimaryKey: true
                        }]
                };
                var keyStore_DataBase = {
                    Name: "KeyStores",
                    Tables: [Table]
                };
                var Db = new DataBase(keyStore_DataBase);
                this.KeyStoreObj = new KeyStore.Business.MainLogic(Db);
                this.KeyStoreObj.createDb();
            }
        }
        Instance.prototype.openDb = function (onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            this.KeyStoreObj.openDb(this, onSuccess, onError);
        };
        Instance.prototype.closeDb = function (onSuccess, onError) {
            this.KeyStoreObj.closeDb();
        };
        Instance.prototype.get = function (key, onSuccess, onError) {
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
                this.openDb(function () {
                    That.get(key, onSuccess, onError);
                });
            }
        };
        Instance.prototype.set = function (key, value, onSuccess, onError) {
            if (onSuccess === void 0) { onSuccess = null; }
            if (onError === void 0) { onError = null; }
            if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.Connected) {
                var IsReturn = false;
                var Value = {
                    Key: key,
                    Value: value
                };
                this.KeyStoreObj.set(this.TableName, Value, IsReturn, onSuccess, onError);
            }
            else if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.set(key, value, onSuccess, onError);
                }, 50);
            }
            else if (KeyStore.Status.ConStatus == KeyStore.ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.set(key, value, onSuccess, onError);
                });
            }
        };
        Instance.prototype.remove = function (key, onSuccess, onError) {
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
                this.openDb(function () {
                    That.remove(key, onSuccess, onError);
                });
            }
        };
        return Instance;
    }());
    KeyStore.Instance = Instance;
})(KeyStore || (KeyStore = {}));
//# sourceMappingURL=KeyStore.js.map