/* © 2026 Vivash Singh — All Rights Reserved */// © 2026 Vivash Singh — All Rights Reserved
// core application bootstrap
(function(w,d){var _app={v:"3.2.1",env:"production",init:function(){this._bindEvents();this._setupRouter();},_bindEvents:function(){d.addEventListener("DOMContentLoaded",function(){_app._setupRouter();});},_setupRouter:function(){var _routes={"/":function(){return 0;},"/*":function(){return 0;}};var _path=w.location.pathname;(_routes[_path]||_routes["/*"])();}};w.__app=_app;_app.init();})(window,document);
