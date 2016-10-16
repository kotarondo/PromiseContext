function writeObj(os, obj) {
    os.writeString("ID");
    os.writeInt(obj.ID);
    var names = obj.getNames();
    os.loop(function(os) {
        name = names.next();
        if (!name) {
            os.end();
            return;
        }
        os.writeString(name);
        writeObj(os, obj[name]);
    });
    os.end();
}

var i = 0;
os.while(function(os) {
    os.writeString(name);
    writeObj(os, obj[name]);
    return (i++ < 10);
});
os.end();

function sub(depth, ctx) {
    if (depth > 100) return;
    ctx.chain(head)
    ctx.call(sub.bind(this, depth + 1))
    ctx.chain(tail)
}

readString(completion) {
    var ctx = this;
    var value;
    ctx.chain(function(resolve, reject)) {
        // fs.readString ...
        value = xxx;
    });
ctx.call(function() {
    completion(value);
});
}

ctx.call(sub.bind(this, 0))


ctx.readString(ID => {
    var obj = new_object(ID);
    ctx.while(function() {
        ctx.readString(name => {
            if (!name) ctx.break();
            ctx.readObject(o => {
                obj[name] = o;
            })
        })
        return true;
    })
});
ctx.end();


ctx.readString(ID => {
    var obj = new_object(ID);
    ctx.while(function() {
        ctx.readString(name => {
            if (!name) ctx.break();
            ctx.readObject(o => {
                obj[name] = o;
            })
        })
        return true;
    })
});
ctx.end();


ctx.readString(ID => {
    var obj = new_object(ID);
});
ctx.while(function() {
    ctx.readString(name => {
        if (!name) ctx.break();
        ctx.name = name;
    })
    ctx.readObject(o => {
        obj[ctx.name] = o;
    })
    return true;
})
ctx.end();
