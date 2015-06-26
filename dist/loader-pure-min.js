!function(){var global={};global.__CONFIG__=window.__CONFIG__,function(e,t){"use strict";var n=t(e);"object"==typeof module&&module&&(module.exports=n),"function"==typeof define&&define.amd&&define(t),e.EventEmitter=n}("undefined"!=typeof global?global:this,function(e){"use strict";function t(){this._events={}}return t.prototype={constructor:t,on:function(e,t){var n=this._events[e]=this._events[e]||[];n.push(t)},off:function(e,t){var n=this._events[e];if(n){var o=n.indexOf(t);o>-1?n.splice(o,1):console.warn("Off: callback was not removed: "+t.toString())}else console.warn("Off: there are no listeners for event: "+e)},emit:function(e,t){var n=this._events[e];if(n){n=n.slice(0);for(var o=0;o<n.length;o++){var i=n[o];i.call(i,t)}}else console.warn("No listeners for event: "+e)}},t}),function(e,t){"use strict";var n=t(e);"object"==typeof module&&module&&(module.exports=n),"function"==typeof define&&define.amd&&define(t),e.ConfigParser=n}("undefined"!=typeof global?global:this,function(e){"use strict";function t(e){this._config={},this._modules={},this._conditionalModules={},this._parseConfig(e)}var n=Object.prototype.hasOwnProperty;return t.prototype={constructor:t,addModule:function(e){var t=this._modules[e.name];if(t)for(var o in e)n.call(e,o)&&(t[o]=e[o]);else this._modules[e.name]=e;return this._registerConditionalModule(e),this._modules[e.name]},getConfig:function(){return this._config},getConditionalModules:function(){return this._conditionalModules},getModules:function(){return this._modules},mapModule:function(e){var t;t=Array.isArray(e)?e:[e];for(var o=0;o<t.length;o++){var i=t[o];for(var r in this._config.maps)if(n.call(this._config.maps,r)&&(i===r||0===i.indexOf(r+"/"))){i=this._config.maps[r]+i.substring(r.length),t[o]=i;break}}return Array.isArray(e)?t:t[0]},_parseConfig:function(e){for(var t in e)n.call(e,t)&&("modules"===t?this._parseModules(e[t]):this._config[t]=e[t]);return this._config},_parseModules:function(e){for(var t in e)if(n.call(e,t)){var o=e[t];o.name=t,this.addModule(o)}return this._modules},_registerConditionalModule:function(e){if(e.condition){var t=this._conditionalModules[e.condition.trigger];t||(this._conditionalModules[e.condition.trigger]=t=[]),t.push(e.name)}}},t}),function(e,t){"use strict";var n=t(e);"object"==typeof module&&module&&(module.exports=n),"function"==typeof define&&define.amd&&define(t),e.DependencyBuilder=n}("undefined"!=typeof global?global:this,function(global){"use strict";function DependencyBuilder(e){this._configParser=e,this._result=[]}var hasOwnProperty=Object.prototype.hasOwnProperty;return DependencyBuilder.prototype={constructor:DependencyBuilder,resolveDependencies:function(e){this._queue=e.slice(0);var t;try{this._resolveDependencies(),t=this._result.reverse().slice(0)}finally{this._cleanup()}return t},_cleanup:function(){var e=this._configParser.getModules();for(var t in e)if(hasOwnProperty.call(e,t)){var n=e[t];n.conditionalMark=!1,n.mark=!1,n.tmpMark=!1}this._queue.length=0,this._result.length=0},_processConditionalModules:function(e){var t=this._configParser.getConditionalModules()[e.name];if(t&&!e.conditionalMark){for(var n=this._configParser.getModules(),o=0;o<t.length;o++){var i=n[t[o]];-1===this._queue.indexOf(i.name)&&this._testConditionalModule(i.condition.test)&&this._queue.push(i.name)}e.conditionalMark=!0}},_resolveDependencies:function(){for(var e=this._configParser.getModules(),t=0;t<this._queue.length;t++){var n=e[this._queue[t]];n.mark||this._visit(n)}},_testConditionalModule:function(testFunction){return"function"==typeof testFunction?testFunction():eval("false || "+testFunction)()},_visit:function(e){if(e.tmpMark)throw new Error("Error processing module: "+e.name+". The provided configuration is not Directed Acyclic Graph.");if(this._processConditionalModules(e),!e.mark){e.tmpMark=!0;for(var t=this._configParser.getModules(),n=0;n<e.dependencies.length;n++){var o=e.dependencies[n];if("exports"!==o&&"module"!==o){o=this._configParser.mapModule(o);var i=t[o];if(!i)throw new Error("Cannot resolve module: "+e.name+" due to not yet registered or wrongly specified dependency: "+o);this._visit(i,t)}}e.mark=!0,e.tmpMark=!1,this._result.unshift(e.name)}},_queue:[]},DependencyBuilder}),function(e,t){"use strict";var n=t(e);"object"==typeof module&&module&&(module.exports=n),"function"==typeof define&&define.amd&&define(t),e.URLBuilder=n}("undefined"!=typeof global?global:this,function(e){"use strict";function t(e){this._configParser=e}var n=/^https?:\/\/|\/\/|www\./;return t.prototype={constructor:t,build:function(e){var t=[],o=[],i=this._configParser.getModules(),r=this._configParser.getConfig(),s=r.basePath;"/"!==s.charAt(s.length-1)&&(s+="/");for(var u=0;u<e.length;u++){var a=i[e[u]];if(a.fullPath)o.push(a.fullPath);else{var l=this._getModulePath(a),d=0===l.indexOf("/");n.test(l)?o.push(l):!r.combine||d?o.push(r.url+(d?"":s)+l):t.push(l)}a.requested=!0}return t.length&&(o.push(r.url+s+t.join("&"+s)),t.length=0),o},_getModulePath:function(e){var t=e.path||e.name,o=this._configParser.getConfig().paths;for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(t===i||0===t.indexOf(i+"/"))&&(t=o[i]+t.substring(i.length));return n.test(t)||t.indexOf(".js")===t.length-3||(t+=".js"),t}},t}),function(e,t){"use strict";var n=t(e);"object"==typeof module&&module&&(module.exports=n),"function"==typeof define&&define.amd&&define(t),e.Loader=new n,e.require=e.Loader.require.bind(e.Loader),e.define=e.Loader.define.bind(e.Loader)}("undefined"!=typeof global?global:this,function(e){"use strict";function t(n){t.superclass.constructor.apply(this,arguments),this._config=n||e.__CONFIG__,this._modulesMap={}}t.prototype=Object.create(e.EventEmitter.prototype),t.prototype.constructor=t,t.superclass=e.EventEmitter.prototype;var n={define:function(e,t,n,o){var i=o||{},r=this._getConfigParser();e=r.mapModule(e),i.name=e,i.dependencies=t,i.pendingImplementation=n,r.addModule(i),this._modulesMap[i.name]||(this._modulesMap[i.name]=!0),this.emit("moduleRegister",e)},getConditionalModules:function(){return this._getConfigParser().getConditionalModules()},getModules:function(){return this._getConfigParser().getModules()},require:function(){var e,t,n,o,i=this,r=Array.isArray?Array.isArray(arguments[0]):"[object Array]"===Object.prototype.toString.call(arguments[0]);if(r)n=arguments[0],o="function"==typeof arguments[1]?arguments[1]:null,e="function"==typeof arguments[2]?arguments[2]:null;else for(n=[],t=0;t<arguments.length;++t)if("string"==typeof arguments[t])n[t]=arguments[t];else if("function"==typeof arguments[t]){o=arguments[t],e="function"==typeof arguments[++t]?arguments[t]:null;break}var s=this._getConfigParser();n=s.mapModule(n);var u=s.getModules();for(t=0;t<n.length;t++)u[n[t]]||s.addModule({name:n[t],dependencies:[]});i._resolveDependencies(n).then(function(e){return i._loadModules(e)}).then(function(e){if(o){var t=i._getModuleImplementations(n);o.apply(o,t)}},function(t){e&&e.call(e,t)})},_createModulePromise:function(e){var t=this;return new Promise(function(n,o){var i=function(o){o===e&&(t.off("moduleRegister",i),t._modulesMap[e]=!0,n(e))};t.on("moduleRegister",i)})},_getConfigParser:function(){return this._configParser||(this._configParser=new e.ConfigParser(this._config)),this._configParser},_getDependencyBuilder:function(){return this._dependencyBuilder||(this._dependencyBuilder=new e.DependencyBuilder(this._getConfigParser())),this._dependencyBuilder},_getMissingDepenencies:function(e){for(var t=this._getConfigParser().getModules(),n=Object.create(null),o=0;o<e.length;o++)for(var i=t[e[o]],r=0;r<i.dependencies.length;r++){var s=i.dependencies[r];"exports"===s||"module"===s||s.pendingImplementation||(n[s]=1)}return Object.keys(n)},_getModuleImplementations:function(e){for(var t=[],n=this._getConfigParser().getModules(),o=0;o<e.length;o++){var i=n[e[o]];t.push(i?i.implementation:void 0)}return t},_getURLBuilder:function(){return this._urlBuilder||(this._urlBuilder=new e.URLBuilder(this._getConfigParser())),this._urlBuilder},_filterNotRequestedModules:function(e){for(var t=[],n=this._getConfigParser().getModules(),o=0;o<e.length;o++){var i=n[e[o]];"exports"===i||"module"===i||i&&i.requested||t.push(e[o])}return t},_loadModules:function(e){var t=this;return new Promise(function(n,o){var i=t._filterNotRequestedModules(e);if(i.length){for(var r=t._getURLBuilder().build(i),s=[],u=0;u<r.length;u++)s.push(t._loadScript(r[u]));Promise.all(s).then(function(n){return t._waitForModules(e)}).then(function(e){n(e)})["catch"](function(e){o(e)})}else t._waitForModules(e).then(function(e){n(e)})["catch"](function(e){o(e)})})},_loadScript:function(e){return new Promise(function(t,n){var o=document.createElement("script");o.src=e,o.onload=o.onreadystatechange=function(){this.readyState&&"complete"!==this.readyState&&"load"!==this.readyState||(o.onload=o.onreadystatechange=null,t(o))},o.onerror=function(){document.body.removeChild(o),n(o)},document.body.appendChild(o)})},_resolveDependencies:function(e){var t=this;return new Promise(function(n,o){try{var i=t._getDependencyBuilder().resolveDependencies(e);n(i)}catch(r){o(r)}})},_setModuleImplementation:function(e){for(var t=this._getConfigParser().getModules(),n=0;n<e.length;n++){var o=e[n];if(!o.implementation){for(var i,r=[],s=0;s<o.dependencies.length;s++){var u=o.dependencies[s];if("exports"===u)i={},r.push(i);else if("module"===u)i={exports:{}},r.push(i);else{u=this._getConfigParser().mapModule(u);var a=t[u],l=a.implementation;r.push(l)}}var d=o.pendingImplementation.apply(o.pendingImplementation,r);d?o.implementation=d:i&&(o.implementation=i.exports||i)}}},_waitForModule:function(e){var t=this,n=t._modulesMap[e];return n||(n=t._createModulePromise(e),t._modulesMap[e]=n),n},_waitForModules:function(e){var t=this;return new Promise(function(n,o){for(var i=[],r=0;r<e.length;r++)i.push(t._waitForModule(e[r]));Promise.all(i).then(function(i){var r=t._getConfigParser().getModules(),s=function(){for(var o=[],i=0;i<e.length;i++)o.push(r[e[i]]);t._setModuleImplementation(o),n(o)},u=t._getMissingDepenencies(e);u.length?t.require(u,s,o):s()})})}};return Object.keys(n).forEach(function(e){t.prototype[e]=n[e]}),t}),window.Loader=global.Loader,window.require=global.require,window.define=global.define}();