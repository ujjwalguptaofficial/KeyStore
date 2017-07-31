/*! KeyStore - v1.1. - 30/7/2017
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
    interface ISet {
        Key: string;
        Value: any;
        any: any;
    }
    var KeyStoreObj: any, Status: KeyStoreStatus, TableName: string, openDb: () => void;
}
declare module KeyStore {
    var init: () => void;
    var get: (key: string, onSuccess: Function, onError?: Function) => void;
    var set: (key: any, value: any, onSuccess?: Function, onError?: Function) => void;
    var remove: (key: string, onSuccess?: Function, onError?: Function) => void;
}
declare module KeyStore {
    interface IError {
        Name: string;
        Value: string;
    }
    class UtilityLogic {
        static setDbType: () => void;
    }
}
declare module KeyStore {
    module Business {
        class BaseLogic {
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
        class GetLogic extends BaseLogic {
            Query: ISelect;
            private get;
            constructor(query: ISelect, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        class InitDbLogic {
            constructor(dbName: string, tableName: string);
        }
    }
}
declare module KeyStore {
    module Business {
        var DbConnection: any;
        class MainLogic {
            set: (tableName: string, value: any, onSuccess: Function, onError: Function) => void;
            remove: (query: IDelete, onSuccess: Function, onError: Function) => void;
            get: (query: ISelect, onSuccess: Function, onError: Function) => void;
            createDb: (tableName: any) => void;
        }
    }
}
declare module KeyStore {
    module Business {
        class RemoveLogic extends BaseLogic {
            Query: IDelete;
            RowAffected: number;
            private remove;
            constructor(query: IDelete, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        class SetLogic extends BaseLogic {
            private setData;
            constructor(tableName: string, value: any, onSuccess: Function, onError: Function);
        }
    }
}
