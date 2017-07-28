module KeyStore {
    export enum ErrorType {
        UndefinedColumn,
        UndefinedValue,
        UndefinedColumnName,
        UndefinedColumnValue,
        NotArray,
        NoValueSupplied,
        ColumnNotExist,
        InvalidOp,
        NullValue,
        BadDataType,
        NextJoinNotExist,
        TableNotExist
    }

    export interface ISelect {
        From: any,
        Where: any
    }


    export interface IDelete {
        From: string,
        Where: any
    }

    export interface IInsert {
        Into: string,
        Values: Array<IValue>,
        Return: boolean
    }

    export interface IValue {
        Column: string,
        Value: string
    }

    export interface ICondition {
        Column: string,
        Value: string,
        Op: string
    }

    export enum ConnectionStatus {
        Connected = 1,
        Closed = 2,
        NotStarted = 3
    }

    export interface KeyStoreStatus {
        ConStatus: ConnectionStatus,
        LastError: string
    }

    export var Status: KeyStoreStatus = <KeyStoreStatus>{
        ConStatus: ConnectionStatus.NotStarted,
        LastError: ""
    };

    export interface ISet {
        Key: string,
        Value; any
    }

}