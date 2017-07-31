# Overview

keyStore is a storage library for javascript. It saves data in key and value pair in  indexedDb.It acts as an alternative of localStorage.

# Feature

1. Preserves data type.
2. No size limitation.
3. Can save any type of data including object or blob storage. 
4. Asynchronous api

# Doc

## Initialize KeyStore

```
KeyStore.init();

```
## set - This will insert or update data.

```
Syntax: KeyStore.set(Key,value,callBack);

Example -

KeyStore.set('form-data',{
    Name:'Ujjwal Gupta',
    Country:'India',
    State:'Odisha',
    City:'Bhubaneswar'
});

or with callback

KeyStore.set('hello','world',function(){
	
});

```
### Note : - callback will be executed when data has been successfully inserted.

## get - This will return data in callback.

```
Syntax: KeyStore.get(Key,callBack);

Example -

KeyStore.get('c',function(result){
    console.log(result);
})

```

## remove - This will remove data

```
Syntax: KeyStore.remove(Key,callBack);

Example-

KeyStore.remove('c');

or with callback

KeyStore.remove('c',function(result){
	console.log(result);
})

```

