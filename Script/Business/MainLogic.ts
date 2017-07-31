module KeyStore {
    export module Business {
        export var DbConnection;
        export class MainLogic {
            public set = function (tableName: string, value, onSuccess: Function, onError: Function) {
                var ObjInsert = new SetLogic(tableName, value, onSuccess, onError);
            }

            public remove = function (query: IDelete, onSuccess: Function, onError: Function) {
                var ObjDelete = new RemoveLogic(query, onSuccess, onError);
            }

            public get = function (query: ISelect, onSuccess: Function, onError: Function) {
                new GetLogic(query, onSuccess, onError);
            }

            public createDb = function (tableName) {
                var DbName = "KeyStore";
                new InitDbLogic(DbName, tableName);
            }
        }
    }
}
