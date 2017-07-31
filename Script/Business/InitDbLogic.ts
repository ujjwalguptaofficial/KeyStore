module KeyStore {
    export module Business {
        export class InitDbLogic {
            constructor(dbName: string, tableName: string) {
                var That = this,
                    DbRequest = window.indexedDB.open(dbName, 1);

                DbRequest.onerror = function (event) {
                    console.error((event as any).target.error);
                };

                DbRequest.onsuccess = function (event) {
                    Status.ConStatus = ConnectionStatus.Connected;
                    DbConnection = DbRequest.result;
                    DbConnection.onclose = function () {
                        Status.ConStatus = ConnectionStatus.Closed;
                        Status.LastError = "Connection Closed";
                    }

                    DbConnection.onversionchange = function (e) {
                        if (e.newVersion === null) { // An attempt is made to delete the db
                            e.target.close(); // Manually close our connection to the db
                        }
                    };

                    DbConnection.onerror = function (e) {
                        Status.LastError = "Error occured in connection :" + e.target.result;
                    }

                    DbConnection.onabort = function (e) {
                        Status.ConStatus = ConnectionStatus.Closed;
                        Status.LastError = "Connection aborted";
                    }
                };

                DbRequest.onupgradeneeded = function (event) {
                    var db = (<any>event).target.result,
                        Column = "Key";
                    db.createObjectStore(tableName, {
                        keyPath: Column
                    }).createIndex(Column, Column, { unique: true });
                }
            }
        }
    }
}