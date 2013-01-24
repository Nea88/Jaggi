module.exports = require('inherit')({
    __constructor : function(params) {
        this._params = params || {};
    },

    params : function(val) {
        if(!arguments.length) {
            return this._params;
        }

        this._params = val;

        return this;
    },

    param : function(name, val) {
        if(arguments.length === 1) {
            return this._params[name];
        }

        this._params[name] = val;

        return this;
    }
});