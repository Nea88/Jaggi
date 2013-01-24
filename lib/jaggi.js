var inherit = require('inherit'),
    EventEmitter = require('events').EventEmitter,
    BlockRunner = require('./block-runner'),
    Ctx = require('./ctx'),
    State = require('./state'),
    Block = require('./block'),
    Cache = require('./cache'),
    CacheFactory = require('./cache-factory'),
    utils = require('./utils');

var DEFAULT_PARAMS = {
        timeout         : 5000,
        root            : __dirname,
        maxIncludeDepth : 10,
        contextFactory  : function(ctx) {
            return new Ctx(ctx);
        }
    };

var Jaggi = inherit({

    /**
     * @constructs
     * @private
     * @param {Object} runner
     * @param {Object} emitter
    **/
    __constructor : function(runner, emitter) {
        this._runner = runner;
        this._emitter = emitter;
    },

    /**
     * Runs application for gets data
     * @public
     * @returns {Object} promise
    **/
    run : function() {
        return this._runner.run();
    },

    /**
     * Aborts getting data and reject promise
     * @public
    **/
    abort : function() {
        this._runner.abort();
    },

    /**
     * Added listeners, which setted in __constructor
     * @public
     * @returns {Object} this 
    **/
    on : function() {
        this._emitter.on.apply(this._emitter, arguments);
        return this;
    },

    /**
     *Added once listener, which setted in __constructor
     *@public
     *@returns {Object} this
    **/
    once : function() {
        this._emitter.once.apply(this._emitter, arguments);
        return this;
    },

    /**
     *Unset listener, which setted in __constructor
     *@public
      @returns {Object} this
    **/
    un : function() {
        this._emitter.removeListener.apply(this._emitter, arguments);
        return this;
    }
});

module.exports = {

    /**
     *Declarate context
     *@public
     *@returns {Object} 
    **/
    declContext : function(props, staticProps) {
        return inherit(Ctx, props, staticProps);
    },

    declBlock : function(props, staticProps) {
        return inherit(Block, props, staticProps);
    },

    declCache : function(props, staticProps) {
        return inherit(Cache, props, staticProps);
    },
    /**
     * Initial function for Jaggi
     *@public
     *@param {Object} initial params
     *@param {Object} request and response
     *@param {Object} other params (see DEFAULT_PARAMS)
     *@returns {Object} Jaggi
    **/
    create : function(desc, ctx, params) {
        var emitter = new EventEmitter();

        return new Jaggi(
            BlockRunner.create(
                desc,
                utils.merge(
                    ctx,
                    { state : new State() }),
                utils.merge(
                    DEFAULT_PARAMS,
                    params,
                    {
                        emitter      : emitter,
                        path         : '.',
                        cacheFactory : new CacheFactory(params && params.cacheFactory)
                    })),
            emitter);
    }
};