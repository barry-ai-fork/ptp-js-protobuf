## minipbjs ![npm](https://img.shields.io/npm/v/minipbjs?color=0c0&style=flat-square)

English | [中文](https://github.com/mustime/minipbjs/blob/main/README.zh-CN.md)

**minipbjs** is a command line tool based on `pbjs` from [protobuf.js](https://github.com/protobufjs/protobuf.js) project, which targets on minimizing the generated javascript code while keeping the same functionality. Compatible to `Node.js`, browsers, wechat miniprogram and other instant-games. Making it perfectly suitable for the scenarios like wechat miniprogram which requires code size restrictions.

## Installation & Example

### installing

```bash
# install `minipbjs` globally with option -g
$> npm install minipbjs -g
```

### Generating Javascript code

```bash
# With same usage with pbjs
$> minipbjs --keep-case # Keeps field casing instead of converting to camel case.
            --root PB   # Specifies an alternative protobuf.roots name.
            # Adds a directory to the include path. Following with target protofiles
            --path /path/to/protofiles a.proto b.proto c.proto ...
            # Notice: --out option in pbjs refers to a file, but it refers to a dir in minipbjs
            --out /path/to/protobuf-bundles/
            # Additional options in minipbjs:
            #   --name Specifies the output Javascript filename,'protobuf-bundles' by default.
            --name protobuf-bundles-mini

# Automatically generates Javascript files specified with --name options.
# Along with the uglified min.js.
$> ls -al /path/to/protobuf-bundles/
 > -rw-r--r--   1 mustime staff  xxxx  protobuf-bundles-mini.js
 > -rw-r--r--   1 mustime staff  xxxx  protobuf-bundles-mini.min.js
 
```

### Using in program

```javascript
// require the necessary protobuf-library first
require('protobuf-library-minimal.js');
require('protobuf-bundles-mini.js');

// a simple test(PB variable is specified by `--root PB` option)
var payload = { 'a': 1, 'b': 'test' };
var foo = PB.foo.Foo.create(payload);
var bytes = PB.foo.Foo.encode(foo).finish();
var foo2 = PB.foo.Foo.decode(bytes);
var foo3 = PB.foo.Foo.fromObject(PB.foo.Foo.toObject(foo2));

// they should print the same
console.log(foo.a, foo2.a, foo3.a);
console.log(foo.b, foo2.b, foo3.b);

// see futher tests under 'minipbjs/tests'
```


## Comparison with pbjs

### Under the hood

The Javascript static code generated by `pbjs --target static` contains function stubs like `constructor`, `create`, `encode`, `decode`, `fromObject` and `toObject`, etc. These function stubs are generated individually for **each** message. Which means that these function stubs are distinguish to each other and unlikely be able to share with other messages. Normally we have to strip some less frequently used functionality like `create`/`fromObject`/`toObject` by `--no-create`/`--no-convert`, etc., but the resulting min.js is usually remarkable huge.

However, `minipbjs` pulls basic info from each message(id, name, default value, options, etc.) into a single map. And providing major functionality(currently supports `create`/`encode`/`decode`/`encodeDelimited`/`decodeDelimited`/`fromObject`/`toObject`/`toJSON`/`verify`) as shared implements for all message. No need to care about the negligible code size anymore.

### Comparison

Take my recent project as example, which is a wechat minigame contains more than 2500 messages. On my 2019 RMBP-15, it costs more than 40s to run `pbjs --target static`, resulting in a 5.2+m min.js file. Meanwhile, running with `minipbjs`(remove `--target static` option as well, or minipbjs will perform the same as pbjs) costs only 1.6s, resulting with a 160+kB min.js.

## Liscense

This project is liscensed under `The MIT Liscense`. 

Enjoy. [Let me know](https://github.com/mustime/minipbjs/issues) if you have any suggestion or encountering with any problem : ).
