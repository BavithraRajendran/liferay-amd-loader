(function() {
	var global = {};

	global.__CONFIG__ = window.__CONFIG__;

	(function (global, factory) {
    'use strict';

    var built = factory(global);

    /* istanbul ignore else */
    if (typeof module === 'object' && module) {
        module.exports = built;
    }

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }

    global.PathResolver = built;
}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this, function (global) {

    'use strict';

/**
 * Creates an instance of PathResolver class.
 *
 * @constructor
 */
function PathResolver() {}

PathResolver.prototype = {
    constructor: PathResolver,

    /**
     * Resolves the path of module.
     *
     * @param {string} module Module path which will be used as reference to resolve the path of the dependency.
     * @param {string} dependency The dependency path, which have to be resolved.
     * @return {string} The resolved dependency path.
     */
    resolvePath: function(module, dependency) {
        if (dependency === 'exports') {
            return dependency;
        }

        // Split module directories
        var moduleParts = module.split('/');
        // Remove module name
        moduleParts.splice(-1);

        // Split dependency directories
        var dependencyParts = dependency.split('/');
        // Extract dependecy name
        var dependencyName = dependencyParts.splice(-1);

        for (var i = 0; i < dependencyParts.length; i++) {
            var dependencyPart = dependencyParts[i];

            if (dependencyPart === '.') {
                continue;

            } else if (dependencyPart === '..') {
                if (moduleParts.length) {
                    moduleParts.splice(-1, 1);
                }
                else {
                    moduleParts = moduleParts.concat(dependencyParts.slice(i));

                    break;
                }

            } else {
                moduleParts.push(dependencyPart);
            }
        }

        moduleParts.push(dependencyName);

        return moduleParts.join('/');
    }
};

    return PathResolver;
}));
(function (global, factory) {
    'use strict';

    var built = factory(global);

    /* istanbul ignore else */
    if (typeof module === 'object' && module) {
        module.exports = built;
    }

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }

    global.EventEmitter = built;
}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this, function (global) {

    'use strict';

/**
 * Creates an instance of EventEmitter class.
 *
 * @constructor
 */
function EventEmitter() {
    this._events = {};
}

EventEmitter.prototype = {
    constructor: EventEmitter,

    /**
     * Adds event listener to an event.
     *
     * @param {string} event The name of the event.
     * @param {Function} callback Callback method to be invoked when event is being emitted.
     */
    on: function (event, callback) {
        var listeners = this._events[event] = this._events[event] || [];

        listeners.push(callback);
    },

    /**
     * Removes an event from the list of event listeners to some event.
     *
     * @param {string} event The name of the event.
     * @param {function} callback Callback method to be removed from the list of listeners.
     */
    off: function (event, callback) {
        var listeners = this._events[event];

        if (listeners) {
            var callbackIndex = listeners.indexOf(callback);

            if (callbackIndex > -1) {
                listeners.splice(callbackIndex, 1);
            } else {
                console.warn('Off: callback was not removed: ' + callback.toString());
            }
        } else {
            console.warn('Off: there are no listeners for event: ' + event);
        }
    },

    /**
     * Emits an event. The function calls all registered listeners in the order they have been added. The provided args
     * param will be passed to each listener of the event.
     *
     * @param {string} event The name of the event.
     * @param {object} args Object, which will be passed to the listener as only argument.
     */
    emit: function (event, args) {
        var listeners = this._events[event];

        if (listeners) {
            // Slicing is needed to prevent the following situation:
            // A listener is being invoked. During its execution, it may
            // remove itself from the list. In this case, for loop will
            // be damaged, since i will be out of sync.
            listeners = listeners.slice(0);

            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];

                listener.call(listener, args);
            }
        } else {
            console.warn('No listeners for event: ' + event);
        }
    }
};

    return EventEmitter;
}));
(function (global, factory) {
    'use strict';

    var built = factory(global);

    /* istanbul ignore else */
    if (typeof module === 'object' && module) {
        module.exports = built;
    }

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }

    global.ConfigParser = built;
}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this, function (global) {

    'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Creates an instance of ConfigurationParser class.
 *
 * @constructor
 * @param {object=} - The configuration object to be parsed.
 */
function ConfigParser(config) {
    this._config = {};
    this._modules = {};
    this._conditionalModules = {};

    this._parseConfig(config);
}

ConfigParser.prototype = {
    constructor: ConfigParser,

    /**
     * Adds a module to the configuration.
     *
     * @param {object} module The module which should be added to the configuration. Should have the following
     *     properties:
     *     <ul>
     *         <strong>Obligatory properties</strong>:
     *         <li>name (String) The name of the module</li>
     *         <li>dependencies (Array) The modules from which it depends</li>
     *     </ul>
     *
     *     <strong>Optional parameters:</strong>
     *     The same as those which config parameter of {@link Loader#define} method accepts.
     */
    addModule: function (module) {
        this._modules[module.name] = module;

        this.resolvePath(module);

        this._registerConditionalModule(module);
    },

    /**
     * Returns the current configuration.
     *
     * @return {object} The current configuration.
     */
    getConfig: function() {
        return this._config;
    },

    /**
     * Returns map with all currently registered conditional modules and their triggers.
     *
     * @return {object} Map with all currently registered conditional modules.
     */
    getConditionalModules: function () {
        return this._conditionalModules;
    },

    /**
     * Returns map with all currently registered modules.
     *
     * @return {object} Map with all currently registered modules.
     */
    getModules: function () {
        return this._modules;
    },

    /**
     * Resolves module path.
     *
     * @param {object} module The module, which path should be resolved.
     */
    resolvePath: function(module) {
        var dependencies = module.dependencies;

        for (var i = 0; i < dependencies.length; i++) {
            var resolvedDependency = this._getPathResolver().resolvePath(module.name, dependencies[i]);

            dependencies[i] = resolvedDependency;
        }
    },

    /**
     * Returns the currently used instance of {@link PathResolver} object.
     *
     * @protected
     * @return {PathResolver} Instance of {@link PathResolver}
     */
    _getPathResolver: function() {
        if (!this._pathResolver) {
            this._pathResolver = new global.PathResolver();
        }

        return this._pathResolver;
    },

    /**
     * Parses configuration object.
     *
     * @protected
     * @param {object} config Configuration object to be parsed.
     * @return {object} The created configuration
     */
    _parseConfig: function (config) {
        for (var key in config) {
            /* istanbul ignore else */
            if (hasOwnProperty.call(config, key)) {
                if (key === 'modules') {
                    this._parseModules(config[key]);
                } else {
                    this._config[key] = config[key];
                }
            }
        }

        return this._config;
    },

    /**
     * Parses a provided modules configuration.
     *
     * @protected
     * @param {object} modules Map of modules to be parsed.
     * @return {object} Map of parsed modules.
     */
    _parseModules: function (modules) {
        for (var key in modules) {
            /* istanbul ignore else */
            if (hasOwnProperty.call(modules, key)) {
                var module = modules[key];

                module.name = key;

                this.addModule(module);
            }
        }

        return this._modules;
    },

    /**
     * Registers conditional module to the configuration.
     *
     * @protected
     * @param {object} module Module object
     */
    _registerConditionalModule: function (module) {
        // Create HashMap of all modules, which have conditional modules, as an Array.
        if (module.condition) {
            var existingModules = this._conditionalModules[module.condition.trigger];

            if (!existingModules) {
                this._conditionalModules[module.condition.trigger] = existingModules = [];
            }

            existingModules.push(module.name);
        }
    }
};

    return ConfigParser;
}));
(function (global, factory) {
    'use strict';

    var built = factory(global);

    /* istanbul ignore else */
    if (typeof module === 'object' && module) {
        module.exports = built;
    }

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }

    global.DependencyBuilder = built;
}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this, function (global) {

    'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Creates an instance of DependencyBuilder class.
 *
 * @constructor
 * @param {object} - instance of {@link ConfigParser} object.
 */
function DependencyBuilder(configParser) {
    this._configParser = configParser;

    this._result = [];
}

DependencyBuilder.prototype = {
    constructor: DependencyBuilder,

    /**
     * Resolves modules dependencies.
     *
     * @param {array} modules List of modules which dependencies should be resolved.
     * @return {array} List of module names, representing module dependencies. Module name itself is being returned too.
     */
    resolveDependencies: function (modules) {
        // Copy the passed modules to a resolving modules queue.
        // Modules may be added there during the process of resolving.
        this._queue = modules.slice(0);

        var result;

        try {
            this._resolveDependencies();

            // Reorder the modules list so the modules without dependencies will
            // be moved upfront
            result = this._result.reverse().slice(0);
        }
        finally {
            this._cleanup();
        }

        return result;
    },

    /**
     * Clears the used resources during the process of resolving dependencies.
     *
     * @protected
     */
    _cleanup: function () {
        var modules = this._configParser.getModules();

        // Set to false all temporary markers which were set during the process of
        // dependencies resolving.
        for (var key in modules) {
            /* istanbul ignore else */
            if (hasOwnProperty.call(modules, key)) {
                var module = modules[key];

                module.conditionalMark = false;
                module.mark = false;
                module.tmpMark = false;
            }
        }

        this._queue.length = 0;
        this._result.length = 0;
    },

    /**
     * Processes conditional modules. If a module has conditional module as dependency, this module will be added to
     * the list of modules, which dependencies should be resolved.
     *
     * @protected
     * @param {object} module Module, which will be checked for conditional modules as dependencies.
     */
    _processConditionalModules: function (module) {
        var conditionalModules = this._configParser.getConditionalModules()[module.name];

        // If the current module has conditional modules as dependencies,
        // add them to the list (queue) of modules, which have to be resolved.
        if (conditionalModules && !module.conditionalMark) {
            var modules = this._configParser.getModules();

            for (var i = 0; i < conditionalModules.length; i++) {
                var conditionalModule = modules[conditionalModules[i]];

                if (this._queue.indexOf(conditionalModule.name) === -1 && this._testConditionalModule(conditionalModule.condition.test)) {

                    this._queue.push(conditionalModule.name);
                }
            }

            module.conditionalMark = true;
        }
    },

    /**
     * Processes all modules in the {@link DependencyBuilder#_queue} and resolves their dependencies. The function
     * implements standard
     * [topological sorting based on depth-first search]{@link http://en.wikipedia.org/wiki/Topological_sorting}.
     *
     * @protected
     */
    _resolveDependencies: function () {
        // Process all modules in the queue.
        // Note: modules may be added to the queue during the process of evaluating.
        var modules = this._configParser.getModules();

        for (var i = 0; i < this._queue.length; i++) {
            var module = modules[this._queue[i]];

            if (!module.mark) {
                this._visit(module);
            }
        }
    },

    /**
     * Executes the test function of an conditional module and adds it to the list of module dependencies if the
     * function returns true.
     *
     * @param {function|string} testFunction The function which have to be executed. May be Function object or string.
     * @return {boolean} The result of the execution of the test function.
     */
    _testConditionalModule: function (testFunction) {
        if (typeof testFunction === 'function') {
            return testFunction();
        } else {
            return eval('false || ' + testFunction)();
        }
    },

    /**
     * Visits a module during the process of resolving dependencies. The function will throw exception in case of
     * circular dependencies among modules.
     *
     * @protected
     * @param {object} module The module which have to be visited.
     */
    _visit: function (module) {
        // Directed Acyclic Graph is supported only, throw exception if there are circular dependencies.
        if (module.tmpMark) {
            throw new Error('Error processing module: ' + module.name + '. ' + 'The provided configuration is not Directed Acyclic Graph.');
        }

        // Check if this module has conditional modules and add them to the queue if so.
        this._processConditionalModules(module);

        if (!module.mark) {
            module.tmpMark = true;

            var modules = this._configParser.getModules();

            for (var i = 0; i < module.dependencies.length; i++) {
                var dependencyName = module.dependencies[i];

                if (dependencyName === 'exports') {
                    continue;
                }

                var moduleDependency = modules[dependencyName];

                this._visit(moduleDependency, modules);
            }

            module.mark = true;

            module.tmpMark = false;

            this._result.unshift(module.name);
        }
    },

    /**
     * @property {array} _queue List of modules, which dependencies should be resolved. Initially, it is copy of
     * the array of modules, passed for resolving; during the process more modules may be added to the queue. For
     * example, these might be conditional modules.
     *
     * @protected
     * @memberof! DependencyBuilder#
     * @default []
     */
    _queue: []
};

    return DependencyBuilder;
}));
(function (global, factory) {
    'use strict';

    var built = factory(global);

    /* istanbul ignore else */
    if (typeof module === 'object' && module) {
        module.exports = built;
    }

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }

    global.URLBuilder = built;
}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this, function (global) {

    'use strict';

/**
 * Creates an instance of URLBuilder class.
 *
 * @constructor
 * @param {object} - instance of {@link ConfigParser} object.
 */
function URLBuilder(configParser) {
    this._configParser = configParser;
}

URLBuilder.prototype = {
    constructor: URLBuilder,

    /**
     * Returns a list of URLs from provided list of modules.
     *
     * @param {array} modules List of modules for which URLs should be created.
     * @return {array} List of URLs.
     */
    build: function (modules) {
        var buffer = [];
        var result = [];

        var registeredModules = this._configParser.getModules();
        var config = this._configParser.getConfig();

        var basePath = config.basePath;

        /* istanbul ignore else */
        if (basePath.charAt(basePath.length - 1) !== '/') {
            basePath += '/';
        }

        for (var i = 0; i < modules.length; i++) {
            var module = registeredModules[modules[i]];

            // If module has fullPath or combine is false, individual URLs have to be created.
            if (module.fullPath) {
                result.push(module.fullPath);

            // If there is no combine, we have to generate full path URL
            } else if (!config.combine) {
                result.push(config.url + basePath + this._getModulePath(module));

            } else {
                // If combine is true and module does not have full path, it will be collected
                // in a buffer to be loaded among with other modules from combo loader.
                buffer.push(this._getModulePath(module));
            }

            module.requested = true;
        }

        // Add to the result all modules, which have to be combined.
        if (buffer.length) {
            result.push(config.url + '?' + basePath + buffer.join('&' + basePath));

            buffer.length = 0;
        }

        return result;
    },

    /**
     * Returns the path for a module. If module has property path, it will be returned directly. Otherwise,
     * the name of module will be used and extension .js will be added to module name if omitted.
     *
     * @protected
     * @param {object} module The module which path should be returned.
     * @return {string} Module path.
     */
    _getModulePath: function(module) {
        if (module.path) {
            return module.path;

        } else if (module.name.indexOf('.js') !== module.name.length - 3) {
            return module.name + '.js';

        } else {
            return module.name;
        }
    }
};

    return URLBuilder;
}));
(function (global, factory) {
    'use strict';

    var built = factory(global);

    /* istanbul ignore else */
    if (typeof module === 'object' && module) {
        module.exports = built;
    }

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }

    /* jshint newcap:false */
    global.Loader = new built();
    global.require = global.Loader.require.bind(global.Loader);
    global.define = global.Loader.define.bind(global.Loader);
}(typeof global !== 'undefined' ? global : /* istanbul ignore next */ this, function (global) {

    'use strict';

/**
 * Creates an instance of Loader class.
 *
 * @namespace Loader
 * @extends EventEmitter
 * @constructor
 */
function Loader(config) {
    Loader.superclass.constructor.apply(this, arguments);

    this._config = config || global.__CONFIG__;

    this._modulesMap = {};
}

extend(Loader, global.EventEmitter, {
    /**
     * Defines a module.
     *
     * @memberof! Loader#
     * @param {string} name The name of the module.
     * @param {array} dependencies List of module dependencies.
     * @param {function} implementation The implementation of the method.
     * @param {object=} config Object configuration:
     * <ul>
     *         <strong>Optional properties</strong>:
     *         <li>path (String) - Explicitly set path of the module. If omitted, module name will be used as path</li>
     *         <li>condition (Object) Object which represents if the module should be added automatically after another
     *             module.
     *         It should have the following properties:</li>
     *             <ul>
     *                 <li>trigger - the module, which should trigger the loading of the current module</li>
     *                 <li>test - function, which should return true if module should be loaded</li>
     *         </ul>
     *     </ul>
     * @return {Object} The constructed module.
     */
    define: function (name, dependencies, implementation, config) {
        // Create new module by merging the provided config with the passed name,
        // dependencies and the implementation.
        var module = config || {};

        module.name = name;
        module.dependencies = dependencies;
        module.pendingImplementation = implementation;

        this._registerModule(module);
    },

    /**
     * Returns list of currently registered conditional modules.
     *
     * @memberof! Loader#
     * @return {array} List of currently registered conditional modules.
     */
    getConditionalModules: function() {
        return this._getConfigParser().getConditionalModules();
    },

    /**
     * Returns list of currently registered modules.
     *
     * @memberof! Loader#
     * @return {array} List of currently registered modules.
     */
    getModules: function() {
        return this._getConfigParser().getModules();
    },

    /**
     * Requires list of modules. If a module is not yet registered, it will be ignored and its implementation
     * in the provided success callback will be left undefined.<br>
     *
     * @memberof! Loader#
     * @param {array|string[]} modules Modules can be specified as an array of strings or provided as
     *     multiple string parameters.
     * @param {function} success Callback, which will be invoked in case of success. The provided parameters will
     *     be implementations of all required modules.
     * @param {function} failure Callback, which will be invoked in case of failure. One parameter with
     *     information about the error will be provided.
     */
    require: function () {
        var self = this;

        var failureCallback;
        var modules;
        var successCallback;

        // Modules can be specified by as an array, or just as parameters to the function
        // We do not slice or leak arguments to not cause V8 performance penalties
        // TODO: This could be improved with inline function (hint)
        var isArgsArray = Array.isArray ? Array.isArray(arguments[0]) : /* istanbul ignore next */
            Object.prototype.toString.call(arguments[0]) === '[object Array]';

        if (isArgsArray) {
            modules = arguments[0];
            successCallback = typeof arguments[1] === 'function' ? arguments[1] : null;
            failureCallback = typeof arguments[2] === 'function' ? arguments[2] : null;

        } else {
            modules = [];

            for (var i = 0; i < arguments.length; ++i) {
                if (typeof arguments[i] === 'string') {
                    modules[i] = arguments[i];

                /* istanbul ignore else */
                } else if (typeof arguments[i] === 'function') {
                    successCallback = arguments[i];
                    failureCallback = typeof arguments[++i] === 'function' ? arguments[i] : /* istanbul ignore next */ null;

                    break;
                }
            }
        }

        // Resolve the dependencies of the specified modules by the user
        // then load their JS scripts
        self._resolveDependencies(modules).then(function (dependencies) {
            return self._loadModules(dependencies);
        }).then(function (loadedModules) {
            var moduleImplementations = self._getModuleImplementations(modules);

            /* istanbul ignore else */
            if (successCallback) {
                successCallback.apply(successCallback, moduleImplementations);
            }
        }, function (error) {
            /* istanbul ignore else */
            if (failureCallback) {
                failureCallback.call(failureCallback, error);

            }
        });
    },

    /**
     * Creates Promise for module. It will be resolved as soon as module is being loaded from server.
     *
     * @memberof! Loader#
     * @protected
     * @param {string} moduleName The name of module for which Promise should be created.
     * @return {Promise} Promise, which will be resolved as soon as the requested module is being loaded.
     */
    _createModulePromise: function(moduleName) {
        var self = this;

        return new Promise(function(resolve, reject) {
            var onModuleRegister = function (registeredModule) {
                if (registeredModule.name === moduleName) {
                    self.off('moduleRegister', onModuleRegister);

                    // Overwrite the promise entry in modules map with simple true value.
                    // Hopefully GC will remove this promise from the memory.
                    self._modulesMap[moduleName] = true;

                    resolve(moduleName);
                }
            };

            self.on('moduleRegister', onModuleRegister);
        });
    },

    /**
     * Returns instance of {@link ConfigParser} class currently used.
     *
     * @memberof! Loader#
     * @protected
     * @return {ConfigParser} Instance of {@link ConfigParser} class.
     */
    _getConfigParser: function () {
        /* istanbul ignore else */
        if (!this._configParser) {
            this._configParser = new global.ConfigParser(this._config);
        }

        return this._configParser;
    },

    /**
     * Returns instance of {@link DependencyBuilder} class currently used.
     *
     * @memberof! Loader#
     * @protected
     * @return {DependencyBuilder} Instance of {@link DependencyBuilder} class.
     */
    _getDependencyBuilder: function () {
        if (!this._dependencyBuilder) {
            this._dependencyBuilder = new global.DependencyBuilder(this._getConfigParser());
        }

        return this._dependencyBuilder;
    },

    /**
     * Retrieves module implementations to an array.
     *
     * @memberof! Loader#
     * @protected
     * @param {array} requiredModules Lit of modules, which implementations will be added to an array.
     * @return {array} List of modules implementations.
     */
    _getModuleImplementations: function (requiredModules) {
        var moduleImplementations = [];

        var modules = this._getConfigParser().getModules();

        for (var i = 0; i < requiredModules.length; i++) {
            var requiredModule = modules[requiredModules[i]];

            moduleImplementations.push(requiredModule ? requiredModule.implementation : undefined);
        }

        return moduleImplementations;
    },

    /**
     * Returns instance of {@link URLBuilder} class currently used.
     *
     * @memberof! Loader#
     * @protected
     * @return {URLBuilder} Instance of {@link URLBuilder} class.
     */
    _getURLBuilder: function () {
        /* istanbul ignore else */
        if (!this._urlBuilder) {
            this._urlBuilder = new global.URLBuilder(this._getConfigParser());
        }

        return this._urlBuilder;
    },

    /**
     * Filters a list of modules and returns only these which have been not yet requested for delivery via network.
     *
     * @memberof! Loader#
     * @protected
     * @param {array} modules List of modules which which will be filtered.
     * @return {array} List of modules not yet requested for delivery via network.
     */
    _filterNotRequestedModules: function (modules) {
        var missingModules = [];

        var registeredModules = this._getConfigParser().getModules();

        for (var i = 0; i < modules.length; i++) {
            var registeredModule = registeredModules[modules[i]];

            // Get all modules which are not yet requested from the server.
            if (registeredModule !== 'exports' &&
                (!registeredModule || !registeredModule.requested)) {

                missingModules.push(modules[i]);
            }
        }

        return missingModules;
    },

    /**
     * Loads list of modules.
     *
     * @memberof! Loader#
     * @protected
     * @param {array} modules List of modules to be loaded.
     * @return {Promise} Promise, which will be resolved as soon as all module a being loaded.
     */
    _loadModules: function (moduleNames) {
        var self = this;

        var a = new Promise(function (resolve, reject) {
            // First, detect any still unloaded modules
            var notRequestedModules = self._filterNotRequestedModules(moduleNames);

            if (notRequestedModules.length) {
                // If there are some, construct the URLs for them
                var urls = self._getURLBuilder().build(notRequestedModules);

                var pendingScripts = [];

                // Create promises for each of the scripts, which should be loaded
                for (var i = 0; i < urls.length; i++) {
                    pendingScripts.push(self._loadScript(urls[i]));
                }

                // Wait for resolving all script Promises
                // As soon as that happens, wait for each module to resolve
                // its own dependencies
                Promise.all(pendingScripts).then(function (loadedScripts) {
                    return self._waitForModules(moduleNames);
                })
                // As soon as all scripts were loaded and all dependencies have been resolved,
                // resolve the main Promise
                .then(function(modules) {
                    resolve(modules);
                })
                // If any script fails to load or other error happens,
                // reject the main Promise
                .catch (function (error) {
                    reject(error);
                });
            } else {
                // If there are no any missing modules, just wait for modules dependencies
                // to be resolved and then resolve the main promise
                self._waitForModules(moduleNames)
                    .then(function(modules) {
                        resolve(modules);
                    })
                    // If some error happens, for example if some module implementation
                    // throws error, reject the main Promise
                    .catch (function (error) {
                        reject(error);
                    });
            }
        });

        return a;
    },

    /**
     * Registers a module to the system and fires {@link Loader#event:moduleRegister} event with the registered module as param.
     *
     * @memberof! Loader#
     * @protected
     * @param {object} module Module which have to be registered.
     */
    _registerModule: function(module) {
        var configParser = this._getConfigParser();

        configParser.addModule(module);

        if (!this._modulesMap[module.name]) {
            this._modulesMap[module.name] = true;
        }

        this.emit('moduleRegister', module);
    },

    /**
     * Loads a &ltscript&gt element on the page.
     *
     * @memberof! Loader#
     * @protected
     * @param {string} url The src of the script.
     * @return {Promise} Promise which will be resolved as soon as the script is being loaded.
     */
    _loadScript: function (url) {
        var a = new Promise(function (resolve, reject) {
            var script = document.createElement('script');

            script.src = url;

            // On ready state change is needed for IE < 9, not sure if that is needed anymore,
            // it depends which browsers will we support at the end
            script.onload = script.onreadystatechange = function () {
                /* istanbul ignore else */
                if (!this.readyState || /* istanbul ignore next */ this.readyState === 'complete' || /* istanbul ignore next */ this.readyState === 'load') {

                    script.onload = script.onreadystatechange = null;

                    resolve(script);
                }
            };

            // If some script fails to load, reject the main Promise
            script.onerror = function () {
                document.body.removeChild(script);

                reject(script);
            };

            document.body.appendChild(script);
        });

        return a;
    },

    /**
     * Resolves modules dependencies.
     *
     * @memberof! Loader#
     * @protected
     * @param {array} modules List of modules which dependencies should be resolved.
     * @return {Promise} Promise which will be resolved as soon as all dependencies are being resolved.
     */
    _resolveDependencies: function (modules) {
        var self = this;

        var a = new Promise(function (resolve, reject) {
            try {
                var registeredModules = self._getConfigParser().getModules();
                var finalModules = [];

                // Ignore wrongly specified byt the user (misspelled) modules
                for (var i = 0; i < modules.length; i++) {
                    if (registeredModules[modules[i]]) {
                        finalModules.push(modules[i]);
                    }
                }

                var dependencies = self._getDependencyBuilder().resolveDependencies(finalModules);

                resolve(dependencies);
            } catch (error) {
                reject(error);
            }
        });

        return a;
    },

    /**
     * Invokes the implementation method of list of modules passing the implementations of its dependencies.
     *
     * @memberof! Loader#
     * @protected
     * @param {array} modules List of modules to which implementation should be set.
     */
    _setModuleImplementation: function(modules) {
        var registeredModules = this._getConfigParser().getModules();

        for (var i = 0; i < modules.length; i++) {
            var module = modules[i];

            if (module.implementation) {
                continue;
            }

            var dependencyImplementations = [];

            // Leave exports implementation undefined by default
            var exportsImpl;

            for (var j = 0; j < module.dependencies.length; j++) {
                var dependency = module.dependencies[j];

                var impl;

                // If the current dependency of this module is 'exports',
                // create an empty object and pass it as implementation of
                // 'exports' module
                if (dependency === 'exports') {
                    exportsImpl = {};

                    dependencyImplementations.push(exportsImpl);
                }
                else {
                    // otherwise set as value the implementation of the
                    // registered module
                    var dependencyModule = registeredModules[dependency];

                    impl = dependencyModule.implementation;

                    dependencyImplementations.push(impl);
                }
            }

            var result = module.pendingImplementation.apply(module.pendingImplementation, dependencyImplementations);

            // Store as implementation either the returned value from function invocation
            // or the implementation of the 'exports' object.
            // The final implementation of this module may be undefined if there is no
            // returned value, or the object does not have 'exports' dependency
            module.implementation = result || exportsImpl;
        }
    },

    /**
     * Resolves a Promise as soon as all module dependencies are being resolved or it has implementation already.
     *
     * @memberof! Loader#
     * @protected
     * @param {object} module The module for which this function should wait.
     * @return {Promise}
     */
    _waitForModule: function(moduleName) {
        var self = this;

        // Check if there is already a promise for this module.
        // If there is not - create one and store it to module promises map.
        var modulePromise = self._modulesMap[moduleName];

        if (!modulePromise) {
            modulePromise = self._createModulePromise(moduleName);

            self._modulesMap[moduleName] = modulePromise;
        }

        return modulePromise;
    },

    /**
     * Resolves a Promise as soon as all dependencies of all provided modules are being resolved and modules have
     * implementations.
     *
     * @memberof! Loader#
     * @protected
     * @param {array} modules List of modules for which implementations this function should wait.
     * @return {Promise}
     */
    _waitForModules: function(moduleNames) {
        var self = this;

        return new Promise(function(resolve, reject) {
            var modulesPromises = [];

            for (var i = 0; i < moduleNames.length; i++) {
                var modulePromise = self._waitForModule(moduleNames[i]);

                modulesPromises.push(modulePromise);
            }

            Promise.all(modulesPromises)
                .then(function(uselessPromises) {
                    var registeredModules = self._getConfigParser().getModules();

                    var definedModules = [];

                    for (var i = 0; i < moduleNames.length; i++) {
                        definedModules.push(registeredModules[moduleNames[i]]);
                    }

                    self._setModuleImplementation(definedModules);

                    resolve(definedModules);
                });
        });
    }

    /**
     * Indicates that a module has been registered.
     *
     * @event Loader#moduleRegister
     * @param {object} module - The registered module.
     */
});

// Utilities methods
function extend(r, s, px) {
    /* istanbul ignore if else */
    if (!s || !r) {
        throw ('extend failed, verify dependencies');
    }

    var sp = s.prototype,
        rp = Object.create(sp);
    r.prototype = rp;

    rp.constructor = r;
    r.superclass = sp;

    /* istanbul ignore if else */
    // assign constructor property
    if (s != Object && sp.constructor == Object.prototype.constructor) {
        sp.constructor = s;
    }

    /* istanbul ignore else */
    // add prototype overrides
    if (px) {
        mix(rp, px);
    }

    return r;
}

function mix(destination, source) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    for (var k in source) {
        /* istanbul ignore else */
        if (hasOwnProperty.call(source, k)) {
            destination[k] = source[k];
        }
    }

    return destination;
}


    return Loader;
}));

	window.Loader = global.Loader;
    window.require = global.require;
    window.define = global.define;
}());