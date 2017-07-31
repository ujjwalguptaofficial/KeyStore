window.onload = function () {
    KeyStore.init();
    registerElementEvents();
}

function registerElementEvents() {
    $('#btnAdd').click(function () {
        var Key = $('#textKey').val(),
            Value = $('#textValue').val(),
            Type = $('#selectType').val();
        switch (Type) {
            case 'bool':
                Value = JSON.parse(Value);
                break;
            case 'number':
                Value = Number(Value);
                break;
            case 'object':
                Value = JSON.parse(Value);
                break;
        }
        KeyStore.set(Key, Value, function () {
            alert('Successfully added');
        }, function (error) {
            console.log(error);
        });
    });

    $('#btnClear').click(function () {
        clear();
    });


}

function clear() {
    $('#textKey').val('');
    $('#textValue').val('');
    $('#selectType').val('string');
}

function getValue(key) {
    KeyStore.get(key, function (result) {
        console.log(result);
    });

}

function removeValue(key) {
    KeyStore.remove(key, function (result) {
        console.log(result);
    });

}