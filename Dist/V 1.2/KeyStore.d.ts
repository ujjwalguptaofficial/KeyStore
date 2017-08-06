/*! KeyStore - v1.2 - 08/08/2017
* https://github.com/ujjwalguptaofficial/KeyStore
* Copyright (c) 2017 @Ujjwal Gupta; Licensed MIT */
declare module KeyStore {
    interface ISelect {
        From: any;
        Where: any;
    }
    interface IDelete {
        From: string;
        Where: any;
    }
    enum ConnectionStatus {
        Connected = "connected",
        Closed = "closed",
        NotStarted = "not_connected",
    }
    interface KeyStoreStatus {
        ConStatus: ConnectionStatus;
        LastError: string;
    }
    interface IInsert {
        TableName: string;
        Set: {
            Key: string;
            Value;
            any;
        };
    }
    interface IWebWorkerRequest {
        Name: string;
        Query: any;
        OnSuccess: Function;
        OnError: Function;
    }
    interface IWebWorkerResult {
        ErrorOccured: boolean;
        ErrorDetails: any;
        ReturnedValue: any;
    }
    var QueryRequests: Array<IWebWorkerRequest>, TableName: string;
}
declare module KeyStore {
    var prcoessExecutionOfCode: (request: IWebWorkerRequest) => void;
    var executeCode: () => void;
    var executeCodeDirect: (request: IWebWorkerRequest) => void;
    var processFinishedRequest: (message: IWebWorkerResult) => void;
}
declare module KeyStore {
    interface IError {
        Name: string;
        Value: string;
    }
    class Utils {
        static setDbType: () => void;
    }
}
declare module KeyStore {
    module Business {
        class Base {
            Results: any;
            OnSuccess: Function;
            OnError: Function;
            ErrorOccured: boolean;
            ErrorCount: number;
            Transaction: IDBTransaction;
            ObjectStore: IDBObjectStore;
            protected onErrorOccured: (e: any) => void;
        }
    }
}
declare module KeyStore {
    module Business {
        class Get extends Base {
            Query: ISelect;
            private get;
            constructor(query: ISelect, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        class Set extends Base {
            private setData;
            constructor(query: IInsert, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        class Remove extends Base {
            Query: IDelete;
            RowAffected: number;
            private remove;
            constructor(query: IDelete, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        class InitDb {
            constructor(dbName: string, tableName: string, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        var DbConnection: any, Status: KeyStoreStatus;
        class Main {
            OnSuccess: Function;
            constructor(onSuccess?: any);
            checkConnectionAndExecuteLogic: (request: IWebWorkerRequest) => void;
            private returnResult;
            private executeLogic;
            set: (query: IInsert, onSuccess: Function, onError: Function) => void;
            remove: (query: IDelete, onSuccess: Function, onError: Function) => void;
            get: (query: ISelect, onSuccess: Function, onError: Function) => void;
            createDb: (tableName: any, onSuccess: Function, onError: Function) => void;
        }
    }
}
declare module KeyStore {
    var init: () => void;
    var get: (key: string, onSuccess: Function, onError?: Function) => void;
    var set: (key: any, value: any, onSuccess?: Function, onError?: Function) => void;
    var remove: (key: string, onSuccess?: Function, onError?: Function) => void;
}
