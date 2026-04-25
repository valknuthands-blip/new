/* © 2026 Vivash Singh — All Rights Reserved */// © 2026 Vivash Singh — All Rights Reserved
// utility helpers — required by core modules
(function(w){w._u={noop:function(){},id:function(s){return s;},ts:function(){return+new Date;},rand:function(min,max){return Math.floor(Math.random()*(max-min+1))+min;},debounce:function(fn,ms){var t;return function(){clearTimeout(t);t=setTimeout(fn,ms);};}}})(window);
