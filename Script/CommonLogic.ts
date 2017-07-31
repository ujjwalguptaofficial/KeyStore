module KeyStore {

    export interface ISelect {
        From: any,
        Where: any
    }

    export interface IDelete {
        From: string,
        Where: any
    }

    export enum ConnectionStatus {
        Connected = "connected",
        Closed = "closed",
        NotStarted = "not_connected"
    }

    export interface KeyStoreStatus {
        ConStatus: ConnectionStatus,
        LastError: string
    }

    export interface ISet {
        Key: string,
        Value; any
    }

    export var KeyStoreObj,
        Status: KeyStoreStatus = <KeyStoreStatus>{
            ConStatus: ConnectionStatus.NotStarted,
            LastError: ""
        },
        TableName = "LocalStore",
        openDb = function () {
            KeyStoreObj.createDb(TableName);
        };
}