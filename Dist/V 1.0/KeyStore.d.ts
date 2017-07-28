declare module KeyStore {
    enum ErrorType {
        UndefinedColumn = 0,
        UndefinedValue = 1,
        UndefinedColumnName = 2,
        UndefinedColumnValue = 3,
        NotArray = 4,
        NoValueSupplied = 5,
        ColumnNotExist = 6,
        InvalidOp = 7,
        NullValue = 8,
        BadDataType = 9,
        NextJoinNotExist = 10,
        TableNotExist = 11,
    }
    interface ISelect {
        From: any;
        Where: any;
    }
    interface IDelete {
        From: string;
        Where: any;
    }
    interface IInsert {
        Into: string;
        Values: Array<IValue>;
        Return: boolean;
    }
    interface IValue {
        Column: string;
        Value: string;
    }
    interface ICondition {
        Column: string;
        Value: string;
        Op: string;
    }
    enum ConnectionStatus {
        Connected = 1,
        Closed = 2,
        NotStarted = 3,
    }
    interface KeyStoreStatus {
        ConStatus: ConnectionStatus;
        LastError: string;
    }
    var Status: KeyStoreStatus;
    interface ISet {
        Key: string;
        Value: any;
        any: any;
    }
}
declare module KeyStore {
    interface IError {
        Name: string;
        Value: string;
    }
    class UtilityLogic {
        static getError(errorType: ErrorType, logError: boolean, errorDetail: any): IError;
        static convertObjectintoLowerCase(obj: any): void;
        static setDbType: () => void;
    }
}
declare module KeyStore {
    module Model {
        interface IColumn {
            Name: string;
            AutoIncrement: boolean;
            PrimaryKey: boolean;
            Unique: boolean;
            CurrentDate: boolean;
            NotNull: boolean;
            DataType: string;
        }
        class Column implements IColumn {
            Name: string;
            AutoIncrement: boolean;
            PrimaryKey: boolean;
            Unique: boolean;
            CurrentDate: boolean;
            NotNull: boolean;
            DataType: string;
            Searchable: boolean;
            constructor(key: IColumn, tableName: string);
        }
    }
}
declare module KeyStore {
    module Model {
        interface ITable {
            Name: string;
            Columns: Array<IColumn>;
            Version: number;
        }
        class Table implements ITable {
            Name: string;
            Columns: Array<Column>;
            Version: number;
            RequireDelete: boolean;
            RequireCreation: boolean;
            PrimaryKey: string;
            constructor(table: ITable, dbName: string);
            private setPrimaryKey();
            private setRequireDelete(dbName);
        }
    }
}
declare module KeyStore {
    module Model {
        interface IDataBase {
            Name: string;
            Tables: Array<ITable>;
        }
        class DataBase implements IDataBase {
            Name: string;
            Tables: Array<Table>;
            constructor(dataBase: IDataBase);
        }
    }
}
declare module KeyStore {
    module Business {
        class CreateDbLogic {
            constructor();
        }
    }
}
declare module KeyStore {
    module Business {
        class RemoveLogic {
            constructor(query: IDelete, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        class SetLogic {
            Store: IDBObjectStore;
            OnSuccess: Function;
            OnError: Function;
            ErrorOccured: boolean;
            ErrorCount: number;
            Error: IError;
            onErrorRequest: (e: any, customError?: boolean) => void;
            constructor(tableName: string, value: any, isReturn: any, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        class OpenDbLogic {
            constructor(objMain: Instance, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        class BaseGetLogic {
            Results: any;
            OnSuccess: Function;
            OnError: Function;
            ErrorOccured: boolean;
            ErrorCount: number;
            Transaction: IDBTransaction;
            ObjectStore: IDBObjectStore;
            onErrorRequest: (e: any) => void;
        }
    }
}
declare module KeyStore {
    module Business {
        class GetLogic extends BaseGetLogic {
            Query: ISelect;
            private executeWhereLogic;
            constructor(query: ISelect, onSuccess: Function, onError: Function);
        }
    }
}
declare module KeyStore {
    module Business {
        var DbConnection: any, DbVersion: number, ActiveDataBase: DataBase;
        class MainLogic {
            constructor(dataBase: DataBase);
            openDb: (objMain: Instance, onSuccess: Function, onError: Function) => void;
            closeDb: () => void;
            set: (tableName: string, value: any, isReturn: any, onSuccess: Function, onError: Function) => void;
            remove: (query: IDelete, onSuccess: Function, onError: Function) => void;
            get: (query: ISelect, onSuccess: Function, onError: Function) => void;
            createDb: () => void;
        }
    }
}
import Model = KeyStore.Model;
import DataBase = Model.DataBase;
import Column = Model.Column;
import Table = Model.Table;
declare module KeyStore {
    class Instance {
        KeyStoreObj: Business.MainLogic;
        TableName: string;
        constructor();
        private openDb(onSuccess?, onError?);
        private closeDb(onSuccess, onError);
        get(key: string, onSuccess: Function, onError?: Function): void;
        set(key: any, value: any, onSuccess?: Function, onError?: Function): void;
        remove(key: string, onSuccess?: Function, onError?: Function): void;
    }
}
