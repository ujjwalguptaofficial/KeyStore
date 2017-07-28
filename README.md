# Overview

keyStore is a library for javascript. It saves data in key and value format in html5 storage technology indexedDb.You can consider this as alternative of localStorage api but it has more features than localStorage.

e.g. - you can store not just string but any type of data including a big object or blog storage.

##You can use KeyStore when localStorage is not working or you want to store more data.

# Doc

## Create Instance

```
var keyStore=new JsStore.KeyStore();

```
## Store Value

```
keyStore.set('hello','world');

or with callback

keyStore.set('hello','world',function(){
	
});

```
### Note : - using callback you can be sure that data has been inserted.

## Get value

```
keyStore.get('c',function(result){
    console.log(result);
})

```
## remove value

```
keyStore.remove('c',function(result){
	console.log(result);
})

```

