import Model = KeyStore.Model;
import DataBase = Model.DataBase;
import Column = Model.Column;
import Table = Model.Table;

module KeyStore {
    export interface ISet {
        Key: string,
        Value; any
    }
    export class Instance {
        KeyStoreObj: Business.MainLogic;
        TableName: string = "LocalStore";
        constructor() {
            if (Status.ConStatus == ConnectionStatus.NotStarted) {
                UtilityLogic.setDbType();
                var Table = <Model.ITable>{
                    Name: this.TableName,
                    Columns: [<Model.IColumn>{
                        Name: "Key",
                        PrimaryKey: true
                    }]
                }

                var keyStore_DataBase = <Model.IDataBase>{
                    Name: "KeyStores",
                    Tables: [Table]
                }

                var Db = new DataBase(keyStore_DataBase);
                this.KeyStoreObj = new Business.MainLogic(Db);
                this.KeyStoreObj.createDb();
            }
        }

        private openDb(onSuccess: Function = null, onError: Function = null) {
            this.KeyStoreObj.openDb(this, onSuccess, onError);
        }

        private closeDb(onSuccess: Function, onError: Function) {
            this.KeyStoreObj.closeDb();
        }

        /**
         * get value based on key
         * 
         * @param {string} key 
         * @param {Function} onSuccess 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        get(key: string, onSuccess: Function, onError: Function = null) {
            if (Status.ConStatus == ConnectionStatus.Connected) {
                var Query = <ISelect>{
                    From: this.TableName,
                    Where: {
                        Key: key
                    }
                }
                this.KeyStoreObj.get(Query, onSuccess, onError);
            }
            else if (Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.get(key, onSuccess, onError);
                }, 50);
            }
            else if (Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.get(key, onSuccess, onError);
                })

            }
        }


        /**
         * set key,value
         * 
         * @param {any} key 
         * @param {any} value 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        set(key, value, onSuccess: Function = null, onError: Function = null) {
            if (Status.ConStatus == ConnectionStatus.Connected) {
                var IsReturn = false;
                var Value = <ISet>{
                    Key: key,
                    Value: value
                }
                this.KeyStoreObj.set(this.TableName, Value, IsReturn, onSuccess, onError);
            }
            else if (Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.set(key, value, onSuccess, onError);
                }, 50);
            }
            else if (Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.set(key, value, onSuccess, onError);
                })

            }
        }

        /**
         * remove value based on key
         * 
         * @param {string} key 
         * @param {Function} [onSuccess=null] 
         * @param {Function} [onError=null] 
         * @memberof Instance
         */
        remove(key: string, onSuccess: Function = null, onError: Function = null) {
            if (Status.ConStatus == ConnectionStatus.Connected) {
                var Query = <IDelete>{
                    From: this.TableName,
                    Where: {
                        Key: key
                    }
                }
                this.KeyStoreObj.remove(Query, onSuccess, onError);
            }
            else if (Status.ConStatus == ConnectionStatus.NotStarted) {
                var That = this;
                setTimeout(function () {
                    That.remove(key, onSuccess, onError);
                }, 50);
            }
            else if (Status.ConStatus == ConnectionStatus.Closed) {
                var That = this;
                this.openDb(function () {
                    That.remove(key, onSuccess, onError);
                })

            }
        }
    }
}
