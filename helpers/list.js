const list = (items, options) => {
    console.log(items);
    console.log(options);

    let out = '<ul>';
    for(let i=0; i<items.length; i++){
        items[i]['my-index'] = i;
        out += '<li>' + options.fn(items[i]) +'</li>';
    }
     out += '</ul>';

    return out;
};

module.exports = list;