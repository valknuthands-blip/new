// (c) 2026 Vivash Singh - All Rights Reserved// © 2026 Vivash Singh — All Rights Reserved
// runtime module loader
(function(w){var _q=[];var _ready=!1;function _flush(){while(_q.length){var fn=_q.shift();try{fn();}catch(e){}}}function _run(fn){if(_ready){try{fn();}catch(e){}}else{_q.push(fn);}}w.addEventListener("load",function(){_ready=!0;_flush();});w.__runtime={run:_run,ready:function(){return _ready;}};})(window);
