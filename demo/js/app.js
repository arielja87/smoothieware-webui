!function(){"use strict";function e(e,t){e.setPrefix("smoothieApp"),t.setOptions({colours:["#FDB45C","#DCDCDC","#F7464A","#46BFBD","#FDB45C","#949FB1","#4D5360"],responsive:!0,maintainAspectRatio:!1})}function t(e,t,n,r){function o(e){var t,n;"bed"==e?(t=30,n=32):(t=200,n=210);var r=Math.random()*(n-t+1)+t;return r.toFixed(1)}e.setCurrentLanguage(t.get("currentLanguage")||"en"),e.debug=!0,n.theme="bs3",n.activate="select";var a=0,i=0,c=0,u=30,s=25,l=22;r.whenPOST("/command").respond(function(e,t,n){var r="ok";n=n.replace(/(\r\n|\n|\r)/gm,"");var d;if("M105"==n)u=o("T0"),s=o("T1"),l=o("bed"),r="ok T:"+u+" /"+a+"@0 ",r+="T1:"+s+" /"+i+"@0 ",r+="B:"+l+" /"+c+"@0 ",r+="P:29.7 /0.0 @0\n";else if("M20"==n)d=Math.floor(2*Math.random()*10+1),r="Begin file list\nconfig.txt\nweb\nweb2\ntest"+(d+2)+".gcode\ntest"+(d-2)+".gcode\ntest"+(d+3)+".gcode\nEnd file list\nok";else if(n.indexOf("M104")>-1||n.indexOf("M140")>-1){var f,h;n.indexOf("M104")>-1?n.indexOf("T1")&&(f=/M104 S(.*) T(.*)/gi,h=f.exec(n),"0"==h[2]?a=Number(h[1]).toFixed(1):i=Number(h[1]).toFixed(1)):(f=/M140 S(.*)/gi,h=f.exec(n),c=Number(h[1]).toFixed(1))}else"progress"==n?r="Nothing is printed":"abort"==n&&(r="Abort! Abort!");return[200,r,{}]}),r.whenGET(/^img\//).passThrough()}angular.module("smoothieApp",["ui.bootstrap","gettext","ngSanitize","luegg.directives","xeditable","LocalStorageModule","ngFileUpload","chart.js","ngMockE2E"]).config(e).run(t),t.$inject=["gettextCatalog","localStorageService","editableOptions","$httpBackend"],e.$inject=["localStorageServiceProvider","ChartJsProvider"]}(),angular.module("gettext").run(["gettextCatalog",function(e){e.setStrings("de",{"Language:":"Sprache:"}),e.setStrings("pl",{Abort:"Przerwij","auto-check every:":"sprawdzaj co:",Autoscroll:"Autoscroll",Bed:"Stół",Clear:"Wyczyść",Commands:"Komendy",Controls:"Sterowanie",Delete:"Usuń","enable second extruder":"włącz drugi ekstruder",Extrude:"Wytłaczaj","Extruder T0":"Ekstruder T0","Extruder T1":"Ekstruder T1",Extruders:"Ekstrudery",Files:"Pliki","Filter temperatures":"Filtruj temperatury","Get temperature":"Sprawdź temperatury","Heater T0":"Głowica T0","Heater T1":"Głowica T1","Language:":"Język:","Motors off":"Wyłącz",Name:"Nazwa",Options:"Opcje",Print:"Drukuj",Progress:"Postęp",Refresh:"Odśwież",Reverse:"Cofnij",sec:"sek",Send:"Wyślij","Send Command...":"Wyślij polecenie",Settings:"Ustawienia","Speed:":"Prędkość:",Temperatures:"Temperatury",Upload:"Wczytaj","Value | Target":"Pomiar | Cel"})}]),function(){"use strict";function e(e,t){function n(){t.registerOutput(s)}function r(){s.command&&(console.log("Command: "+s.command),t.runCommand(s.command).then(function(e){s.updateOutput(e),s.cmdHistory.push(s.command),s.cmdHistory.slice(-300),s.cmdHistoryIdx=s.cmdHistory.length,s.command=""}))}function o(e){var t=e.keyCode;return 38==t||40==t?(38==t&&s.cmdHistory.length>0&&s.cmdHistoryIdx>0?s.cmdHistoryIdx--:40==t&&s.cmdHistoryIdx<s.cmdHistory.length-1&&s.cmdHistoryIdx++,s.cmdHistoryIdx>=0&&s.cmdHistoryIdx<s.cmdHistory.length&&(s.command=s.cmdHistory[s.cmdHistoryIdx]),!1):!0}function a(e){return 13==e.keyCode&&s.sendCommand(),!0}function i(){s.log=[],s.updateOutput()}function c(){s.updateOutput()}function u(e){s.log||(s.log=[]),e&&(s.log=s.log.concat(e),s.log=s.log.slice(-300));for(var t=/ok T:/g,n="",r=s.log.length,o=0;r>o;o++)s.filterOutput&&s.log[o].match(t)||(n+=s.log[o]);s.commandOutput=n}var s=this;s.log=[],s.command="",s.commandOutput="",s.cmdHistory=[],s.cmdHistoryIdx=-1,s.autoscrollEnabled=!0,s.filterOutput=!1,s.sendCommand=r,s.handleKeyDown=o,s.handleKeyUp=a,s.clear=i,s.onFilterChange=c,s.updateOutput=u,n()}angular.module("smoothieApp").controller("CommandCtrl",e),e.$inject=["$scope","DataService"]}(),function(){"use strict";function e(e){function t(){e.updateSecondExtruder()}function n(t,n){console.log("Extruder: "+t+" | length: "+r.filamenLength+" | speed: "+r.velocity),e.runCommand(t).then(function(e){console.log("Extruder result: "+e)}),e.runCommand("G91 G0 E"+r.filamenLength*n+" F"+r.velocity+" G90").then(function(e){console.log("Command result: "+e)})}var r=this;r.secondExtruder=e.secondExtruderState(),r.filamenLength=5,r.velocity=100,r.onSecondExtruderSupportChange=t,r.extrude=n}angular.module("smoothieApp").controller("ExtruderCtrl",e),e.$inject=["DataService"]}(),function(){"use strict";function e(e,t){function n(){r()}function r(){console.log("RefreshFiles"),e.runCommand("M20").then(function(e){o(e)},function(e){console.error(e.statusText)})}function o(e){l.fileList=[];var t=e.split("\n");angular.forEach(t,function(e,t){if(e=e.trim(),e.match(/\.g(code)?$/)){var n={filename:e,uploading:!1,percentage:0};l.fileList.push(n)}})}function a(t){console.log("print file - "+t),e.runCommand("play /sd/"+t).then(function(e){console.log("Result: "+e)})}function i(){e.runCommand("progress").then(function(t){e.broadcastCommand(t)},function(e){console.error(e.statusText)})}function c(){e.runCommand("abort").then(function(t){e.broadcastCommand(t)},function(e){console.error(e.statusText)})}function u(n){n&&(e.broadcastCommand("Uploading: "+n.name+"\n"),l.currentUploadedFile={filename:n.name,uploading:!0,percentage:0},l.fileList.push(l.currentUploadedFile),t.http({url:"/upload",headers:{"X-Filename":n.name},data:n}).then(function(t){e.broadcastCommand("Upload successful. Response: "+t.data),l.currentUploadedFile.uploading=!1,l.refreshFiles()},function(t){e.broadcastCommand("Error status: "+t.status+"\n")},function(e){var t=parseInt(100*e.loaded/e.total);l.currentUploadedFile.percentage=t,console.log("Progress: "+t+"%")}))}function s(t){e.runCommand("M30 "+t.filename).then(function(n){e.broadcastCommand("Deleted file: "+t.filename+"\n"),l.refreshFiles()},function(e){console.error(e.statusText)})}var l=this;l.fileList=[],l.currentUploadedFile={},l.refreshFiles=r,l.print=a,l.progress=i,l.abort=c,l.uploadFile=u,l.deleteFile=s,n()}angular.module("smoothieApp").controller("FileCtrl",e),e.$inject=["DataService","Upload"]}(),function(){"use strict";function e(e,t){function n(n){o.languages.current=n,e.setCurrentLanguage(n),t.set("currentLanguage",o.languages.current)}function r(){t.set("printerName",o.printerName)}var o=this;o.printerName=t.get("printerName")||"Your printer name",o.languages={current:e.currentLanguage,available:{en:"English",pl:"Polski"}},o.setLanguage=n,o.updatePrinterName=r}angular.module("smoothieApp").controller("HeaderCtrl",e),e.$inject=["gettextCatalog","localStorageService"]}(),function(){"use strict";function e(e){function t(e){console.log("Home axis: "+e)}function n(){console.log("MotorsOff"),e.runCommand("M18").then(function(e){console.log("Motors turned off! - Result: "+e)},function(e){console.error(e.statusText)})}function r(t){console.log("jogButtonClick - "+t),e.runCommand(t).then(function(e){console.log("Result: "+e)},function(e){console.error(e.statusText)})}function o(t){console.log("jogXYClick - "+t),e.runCommand("G91 G0 "+t+" F"+i.xy_velocity+" G90").then(function(e){console.log("Result: "+e)},function(e){console.error(e.statusText)})}function a(t){console.log("jogZClick - "+t),e.runCommand("G91 G0 "+t+" F"+i.z_velocity+" G90").then(function(e){console.log("Result: "+e)},function(e){console.error(e.statusText)})}var i=this;i.elementId="",i.xy_velocity=3e3,i.z_velocity=200,i.homeAxis=t,i.motorsOff=n,i.jogButtonClick=r,i.jogXYClick=o,i.jogZClick=a}angular.module("smoothieApp").controller("MotorCtrl",e),e.$inject=["DataService"]}(),function(){"use strict";function e(e,t,n){function r(){d.autoCheckEnabled&&(d.localTempInterval=e(d.onTimeout,1e3*d.tempInterval),d.getTemperatures())}function o(){d.getTemperatures()}function a(e){switch(console.log("HeatOff - heater: "+e),e){case"T0":d.heaterT0SelectedTemp=0;break;case"T1":d.heaterT1SelectedTemp=0;break;case"bed":d.bedSelectedTemp=0}var n="bed"!=e,r=n?104:140,o="M"+r+" S0";n&&(o+=" "+e),t.runCommand(o).then(function(e){d.getTemperatures()})}function i(e){console.log("HeatSet - heater: "+e);var n=0;switch(e){case"T0":n=d.heaterT0SelectedTemp;break;case"T1":n=d.heaterT1SelectedTemp;break;case"bed":n=d.bedSelectedTemp}console.log("Temp: "+n);var r="bed"!=e,o=r?104:140,a="M"+o+" S"+n;r&&(a+=" "+e),t.runCommand(a).then(function(e){d.getTemperatures()})}function c(e,t){return 13==e.keyCode&&d.heatSet(t),!0}function u(){d.autoCheckEnabled?(d.localTempInterval=e(d.onTimeout,1e3*d.tempInterval),n.set("autoCheckEnabled","true"),d.getTemperatures()):(angular.isDefined(d.localTempInterval)&&e.cancel(d.localTempInterval),n.set("autoCheckEnabled","false"))}function s(){n.set("tempInterval",d.tempInterval),angular.isDefined(d.localTempInterval)&&e.cancel(d.localTempInterval),d.localTempInterval=e(d.onTimeout,1e3*d.tempInterval)}function l(){t.runCommand("M105").then(function(e){t.broadcastCommand(e);for(var n,r=/(B|T(\d*)):\s*([+]?[0-9]*\.?[0-9]+)? (\/)([+]?[0-9]*\.?[0-9]+)?/gi;null!==(n=r.exec(e));){var o=n[1],a=n[3]+"°C";a+=" | "+n[5]+"°C","T"==o?(d.heaterT0ActualTemp=n[3],d.heaterT0DisplayTemp=a):"T1"==o&&(d.heaterT1ActualTemp=n[3],d.heaterT1DisplayTemp=a),"B"==o&&(d.bedActualTemp=Number(n[3]),d.bedDisplayTemp=a)}for(d.labels.length&&(d.labels=d.labels.slice(1),d.dataHeater[0]=d.dataHeater[0].slice(1),d.dataBed[0]=d.dataBed[0].slice(1));d.labels.length<20;)d.labels.push(""),d.dataHeater[0].push(d.heaterT0ActualTemp),d.dataBed[0].push(d.bedActualTemp)},function(e){console.error(e.statusText)})}var d=this;d.secondExtruder=t.secondExtruderState(),d.labels=[],d.seriesHeater=["Heater T0"],d.dataHeater=[[]],d.heaterColours=[{backgroundColor:"rgba(77, 83, 96, 0.2)",borderColor:"rgba(77, 83, 96, 0.5)"}],d.seriesBed=["Bed"],d.dataBed=[[]],d.bedColours=[{backgroundColor:"rgba(247, 70, 74, 0.2)",borderColor:"rgba(247, 70, 74, 0.5)"}],Chart.defaults.global.elements.point.radius=0,Chart.defaults.global.legend.position="bottom",Chart.defaults.global.animation.duration=0,Chart.defaults.global.elements.line.borderWidth=1,d.options={tooltips:{enabled:!1},scales:{xAxes:[{gridLines:{display:!1}}]}},d.localTempInterval={},d.tempInterval=n.get("tempInterval")||3,d.autoCheckEnabled="true"==n.get("autoCheckEnabled"),d.heaterT0SelectedTemp=0,d.heaterT0ActualTemp="-",d.heaterT0DisplayTemp="",d.heaterT1SelectedTemp=0,d.heaterT1ActualTemp="-",d.heaterT1DisplayTemp="",d.bedSelectedTemp=0,d.bedActualTemp="-",d.bedDisplayTemp="",d.onTimeout=o,d.heatOff=a,d.heatSet=i,d.handleKeyUp=c,d.onAutoCheckChange=u,d.onTempIntervalChange=s,d.getTemperatures=l,r()}angular.module("smoothieApp").controller("TempCtrl",e),e.$inject=["$interval","DataService","localStorageService"]}(),function(){"use strict";function e(e,t){function n(t){return t+="\n",e.post(c,t).then(function(e){return e.data})}function r(e){s.push(e)}function o(e){for(var t=0;t<s.length;++t)s[t].updateOutput(e)}function a(){return u}function i(){t.set("secondExtruderSupportEnabled",u.supportEnabled?"true":"false")}var c="/command",u={supportEnabled:"true"==t.get("secondExtruderSupportEnabled")},s=[],l={runCommand:n,registerOutput:r,broadcastCommand:o,secondExtruderState:a,updateSecondExtruder:i};return l}angular.module("smoothieApp").factory("DataService",e),e.$inject=["$http","localStorageService"]}(),function(e,t){"use strict";function n(e,n,r){function o(e){var t=e;return{getValue:function(){return t},setValue:function(e){t=e}}}function a(e,t){return{getValue:function(){return e(t)},setValue:function(){}}}function i(e,t,n){return{getValue:function(){return e(n)},setValue:function(r){r!==e(n)&&n.$apply(function(){t(n,r)})}}}if(""!==n){var c=e(n);return c.assign!==t?i(c,c.assign,r):a(c,r)}return o(!0)}function r(e,t,r){e.directive(t,["$parse","$window","$timeout",function(e,o,a){return{priority:1,restrict:"A",link:function(i,c,u){function s(){f.getValue()&&!r.isAttached(d)&&r.scroll(d)}function l(){f.setValue(r.isAttached(d))}var d=c[0],f=n(e,u[t],i);i.$watch(s),a(s,0,!1),o.addEventListener("resize",s,!1),c.bind("scroll",l),c.on("$destroy",function(){c.unbind("scroll",l)}),i.$on("$destroy",function(){o.removeEventListener("resize",s,!1)})}}}])}var o={isAttached:function(e){return e.scrollTop+e.clientHeight+1>=e.scrollHeight},scroll:function(e){e.scrollTop=e.scrollHeight}},a={isAttached:function(e){return e.scrollTop<=1},scroll:function(e){e.scrollTop=0}},i={isAttached:function(e){return e.scrollLeft+e.clientWidth+1>=e.scrollWidth},scroll:function(e){e.scrollLeft=e.scrollWidth}},c={isAttached:function(e){return e.scrollLeft<=1},scroll:function(e){e.scrollLeft=0}},u=e.module("luegg.directives",[]);r(u,"scrollGlue",o),r(u,"scrollGlueTop",a),r(u,"scrollGlueBottom",o),r(u,"scrollGlueLeft",c),r(u,"scrollGlueRight",i)}(angular),!function(e){"use strict";if("object"==typeof exports)module.exports=e("undefined"!=typeof angular?angular:require("angular"),"undefined"!=typeof Chart?Chart:require("chart.js"));else if("function"==typeof define&&define.amd)define(["angular","chart"],e);else{if("undefined"==typeof angular||"undefined"==typeof Chart)throw new Error("Chart.js library needs to included, see http://jtblin.github.io/angular-chart.js/");e(angular,Chart)}}(function(e,t){"use strict";function n(){var n={responsive:!0},r={Chart:t,getOptions:function(t){var r=t&&n[t]||{};return e.extend({},n,r)}};this.setOptions=function(t,r){return r?void(n[t]=e.extend(n[t]||{},r)):(r=t,void(n=e.extend(n,r)))},this.$get=function(){return r}}function r(n,r){function a(e,t,r){var o=y(e,t);if(m(t)&&k(e,t,r,o)){var a=r[0],i=a.getContext("2d");t.chartGetColor=$(t);var c=v(e,t);D(t),t.chart=new n.Chart(i,{type:e,data:c,options:o}),t.$emit("chart-create",t.chart),b(a,t)}}function i(e,t){return e&&t&&e.length&&t.length?Array.isArray(e[0])?e.length===t.length&&e.every(function(e,n){return e.length===t[n].length}):t.reduce(c,0)>0?e.length===t.length:!1:!1}function c(e,t){return e+t}function u(t,n,r){var o=null;return function(a){var i=t.chart.getElementsAtEvent||t.chart.getPointsAtEvent;if(i){var c=i.call(t.chart,a);r!==!1&&e.equals(o,c)!==!1||(o=c,t[n](c,a))}}}function s(r,o){for(var a=e.copy(o.chartColors||n.getOptions(r).chartColors||t.defaults.global.colors),i=a.length<o.chartData.length;a.length<o.chartData.length;)a.push(o.chartGetColor());return i&&(o.chartColors=a),a.map(l)}function l(e){return"object"==typeof e&&null!==e?e:"string"==typeof e&&"#"===e[0]?f(p(e.substr(1))):d()}function d(){var e=[h(0,255),h(0,255),h(0,255)];return f(e)}function f(e){return{backgroundColor:g(e,.2),pointBackgroundColor:g(e,1),pointHoverBackgroundColor:g(e,.8),borderColor:g(e,1),pointBorderColor:"#fff",pointHoverBorderColor:g(e,1)}}function h(e,t){return Math.floor(Math.random()*(t-e+1))+e}function g(e,t){return o?"rgb("+e.join(",")+")":"rgba("+e.concat(t).join(",")+")"}function p(e){var t=parseInt(e,16),n=t>>16&255,r=t>>8&255,o=255&t;return[n,r,o]}function m(e){return e.chartData&&e.chartData.length}function $(e){return"function"==typeof e.chartGetColor?e.chartGetColor:d}function v(e,t){var n=s(e,t);return Array.isArray(t.chartData[0])?C(t.chartLabels,t.chartData,t.chartSeries||[],n,t.chartDatasetOverride):T(t.chartLabels,t.chartData,n,t.chartDatasetOverride)}function C(t,n,r,o,a){return{labels:t,datasets:n.map(function(t,n){var i=e.extend({},o[n],{label:r[n],data:t});return a&&a.length>=n&&e.merge(i,a[n]),i})}}function T(t,n,r,o){var a={labels:t,datasets:[{data:n,backgroundColor:r.map(function(e){return e.pointBackgroundColor}),hoverBackgroundColor:r.map(function(e){return e.backgroundColor})}]};return o&&e.merge(a.datasets[0],o),a}function y(t,r){return e.extend({},n.getOptions(t),r.chartOptions)}function b(t,n){t.onclick=n.chartClick?u(n,"chartClick",!1):e.noop,t.onmousemove=n.chartHover?u(n,"chartHover",!0):e.noop}function w(e,t){Array.isArray(t.chartData[0])?t.chart.data.datasets.forEach(function(t,n){t.data=e[n]}):t.chart.data.datasets[0].data=e,t.chart.update(),t.$emit("chart-update",t.chart)}function E(e){return!e||Array.isArray(e)&&!e.length||"object"==typeof e&&!Object.keys(e).length}function k(e,t,n,o){return o.responsive&&0===n[0].clientHeight?(r(function(){a(e,t,n)},50,!1),!1):!0}function D(e){e.chart&&(e.chart.destroy(),e.$emit("chart-destroy",e.chart))}return function(t){return{restrict:"CA",scope:{chartGetColor:"=?",chartType:"=",chartData:"=?",chartLabels:"=?",chartOptions:"=?",chartSeries:"=?",chartColors:"=?",chartClick:"=?",chartHover:"=?",chartDatasetOverride:"=?"},link:function(n,r){function c(e,o){if(!e||!e.length||Array.isArray(e[0])&&!e[0].length)return void D(n);var c=t||n.chartType;return c?n.chart&&i(e,o)?w(e,n):void a(c,n,r):void 0}function u(o,i){if(!E(o)&&!e.equals(o,i)){var c=t||n.chartType;c&&a(c,n,r)}}function s(t,o){E(t)||e.equals(t,o)||a(t,n,r)}o&&window.G_vmlCanvasManager.initElement(r[0]),n.$watch("chartData",c,!0),n.$watch("chartSeries",u,!0),n.$watch("chartLabels",u,!0),n.$watch("chartOptions",u,!0),n.$watch("chartColors",u,!0),n.$watch("chartDatasetOverride",u,!0),n.$watch("chartType",s,!1),n.$on("$destroy",function(){D(n)}),n.$on("$resize",function(){n.chart&&n.chart.resize()})}}}}t.defaults.global.multiTooltipTemplate="<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>",t.defaults.global.tooltips.mode="label",t.defaults.global.elements.line.borderWidth=2,t.defaults.global.elements.rectangle.borderWidth=2,t.defaults.global.legend.display=!1,t.defaults.global.colors=["#97BBCD","#DCDCDC","#F7464A","#46BFBD","#FDB45C","#949FB1","#4D5360"];var o="object"==typeof window.G_vmlCanvasManager&&null!==window.G_vmlCanvasManager&&"function"==typeof window.G_vmlCanvasManager.initElement;return o&&(t.defaults.global.animation=!1),e.module("chart.js",[]).provider("ChartJs",n).factory("ChartJsFactory",["ChartJs","$timeout",r]).directive("chartBase",["ChartJsFactory",function(e){return new e}]).directive("chartLine",["ChartJsFactory",function(e){return new e("line")}]).directive("chartBar",["ChartJsFactory",function(e){return new e("bar")}]).directive("chartHorizontalBar",["ChartJsFactory",function(e){return new e("horizontalBar")}]).directive("chartRadar",["ChartJsFactory",function(e){return new e("radar")}]).directive("chartDoughnut",["ChartJsFactory",function(e){return new e("doughnut")}]).directive("chartPie",["ChartJsFactory",function(e){return new e("pie")}]).directive("chartPolarArea",["ChartJsFactory",function(e){return new e("polarArea")}]).directive("chartBubble",["ChartJsFactory",function(e){return new e("bubble")}]).name}),function(e,t,n){"use strict";function r(e){var t;if(t=e.match(s)){var n=new Date(0),r=0,a=0;return t[9]&&(r=o(t[9]+t[10]),a=o(t[9]+t[11])),n.setUTCFullYear(o(t[1]),o(t[2])-1,o(t[3])),n.setUTCHours(o(t[4]||0)-r,o(t[5]||0)-a,o(t[6]||0),o(t[7]||0)),n}return e}function o(e){return parseInt(e,10)}function a(e,t,n){var r="";for(0>e&&(r="-",e=-e),e=""+e;e.length<t;)e="0"+e;return n&&(e=e.substr(e.length-t)),r+e}function i(e,r,o,a){function i(e,n,r,o){return t.isFunction(e)?e:function(){return t.isNumber(e)?[e,n,r,o]:[200,e,n,r]}}function s(e,i,c,s,l,d,$,v){function C(e){return t.isString(e)||t.isFunction(e)||e instanceof RegExp?e:t.toJson(e)}function T(t){function o(){var n=t.response(e,i,c,l,t.params(i));y.$$respHeaders=n[2],s(m(n[0]),m(n[1]),y.getAllResponseHeaders(),m(n[3]||""))}function u(){for(var e=0,t=g.length;t>e;e++)if(g[e]===o){g.splice(e,1),s(-1,n,"");break}}return!a&&d&&(d.then?d.then(u):r(u,d)),o}var y=new u,b=h[0],w=!1;if(b&&b.match(e,i)){if(!b.matchData(c))throw new Error("Expected "+b+" with different data\nEXPECTED: "+C(b.data)+"\nGOT:      "+c);if(!b.matchHeaders(l))throw new Error("Expected "+b+" with different headers\nEXPECTED: "+C(b.headers)+"\nGOT:      "+C(l));if(h.shift(),b.response)return void g.push(T(b));w=!0}for(var E,k=-1;E=f[++k];)if(E.match(e,i,c,l||{})){if(E.response)(a?a.defer:p)(T(E));else{if(!E.passThrough)throw new Error("No response defined !");o(e,i,c,s,l,d,$,v)}return}throw w?new Error("No response defined !"):new Error("Unexpected request: "+e+" "+i+"\n"+(b?"Expected "+b:"No more request expected"))}function l(e){var n={regexp:e},r=n.keys=[];return e&&t.isString(e)?(e=e.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?\*])?/g,function(e,t,n,o){var a="?"===o?o:null,i="*"===o?o:null;return r.push({name:n,optional:!!a}),t=t||"",""+(a?"":t)+"(?:"+(a?t:"")+(i&&"(.+?)"||"([^/]+)")+(a||"")+")"+(a||"")}).replace(/([\/$\*])/g,"\\$1"),n.regexp=new RegExp("^"+e,"i"),n):n}function d(e){t.forEach(["GET","DELETE","JSONP","HEAD"],function(t){s[e+t]=function(r,o,a){return s[e](t,r,n,o,a)}}),t.forEach(["PUT","POST","PATCH"],function(t){s[e+t]=function(n,r,o,a){return s[e](t,n,r,o,a)}})}var f=[],h=[],g=[],p=t.bind(g,g.push),m=t.copy;return s.when=function(e,t,r,o,u){var s=new c(e,t,r,o,u),l={respond:function(e,t,r,o){return s.passThrough=n,s.response=i(e,t,r,o),l}};return a&&(l.passThrough=function(){return s.response=n,s.passThrough=!0,l}),f.push(s),l},d("when"),s.whenRoute=function(e,t){var r=l(t);return s.when(e,r.regexp,n,n,r.keys)},s.expect=function(e,t,n,r,o){var a=new c(e,t,n,r,o),u={respond:function(e,t,n,r){return a.response=i(e,t,n,r),u}};return h.push(a),u},d("expect"),s.expectRoute=function(e,t){var r=l(t);return s.expect(e,r.regexp,n,n,r.keys)},s.flush=function(n,r){if(r!==!1&&e.$digest(),!g.length)throw new Error("No pending request to flush !");if(t.isDefined(n)&&null!==n)for(;n--;){if(!g.length)throw new Error("No more pending request to flush !");g.shift()()}else for(;g.length;)g.shift()();s.verifyNoOutstandingExpectation(r)},s.verifyNoOutstandingExpectation=function(t){if(t!==!1&&e.$digest(),h.length)throw new Error("Unsatisfied requests: "+h.join(", "))},s.verifyNoOutstandingRequest=function(){if(g.length)throw new Error("Unflushed requests: "+g.length)},s.resetExpectations=function(){h.length=0,g.length=0},s}function c(e,n,r,o,a){this.data=r,this.headers=o,this.match=function(n,r,o,a){return e!=n?!1:this.matchUrl(r)?t.isDefined(o)&&!this.matchData(o)?!1:!t.isDefined(a)||this.matchHeaders(a):!1},this.matchUrl=function(e){return n?t.isFunction(n.test)?n.test(e):t.isFunction(n)?n(e):n==e:!0},this.matchHeaders=function(e){return t.isUndefined(o)?!0:t.isFunction(o)?o(e):t.equals(o,e)},this.matchData=function(e){return t.isUndefined(r)?!0:r&&t.isFunction(r.test)?r.test(e):r&&t.isFunction(r)?r(e):r&&!t.isString(r)?t.equals(t.fromJson(t.toJson(r)),t.fromJson(e)):r==e},this.toString=function(){return e+" "+n},this.params=function(e){function r(){var r={};if(!n||!t.isFunction(n.test)||!a||0===a.length)return r;var o=n.exec(e);if(!o)return r;for(var i=1,c=o.length;c>i;++i){var u=a[i-1],s=o[i];u&&s&&(r[u.name||u]=s)}return r}function o(){var n,r,o={},a=e.indexOf("?")>-1?e.substring(e.indexOf("?")+1):"";return t.forEach(a.split("&"),function(e){if(e&&(n=e.replace(/\+/g,"%20").split("="),r=i(n[0]),t.isDefined(r))){var a=t.isDefined(n[1])?i(n[1]):!0;hasOwnProperty.call(o,r)?t.isArray(o[r])?o[r].push(a):o[r]=[o[r],a]:o[r]=a}}),o}function i(e){try{return decodeURIComponent(e)}catch(t){}}return t.extend(o(),r())}}function u(){u.$$lastInstance=this,this.open=function(e,t,n){this.$$method=e,this.$$url=t,this.$$async=n,this.$$reqHeaders={},this.$$respHeaders={}},this.send=function(e){this.$$data=e},this.setRequestHeader=function(e,t){this.$$reqHeaders[e]=t},this.getResponseHeader=function(e){var r=this.$$respHeaders[e];return r?r:(e=t.lowercase(e),(r=this.$$respHeaders[e])?r:(r=n,t.forEach(this.$$respHeaders,function(n,o){r||t.lowercase(o)!=e||(r=n)}),r))},this.getAllResponseHeaders=function(){var e=[];return t.forEach(this.$$respHeaders,function(t,n){e.push(n+": "+t)}),e.join("\n")},this.abort=t.noop}t.mock={},t.mock.$BrowserProvider=function(){this.$get=function(){return new t.mock.$Browser}},t.mock.$Browser=function(){var e=this;this.isMock=!0,e.$$url="http://server/",e.$$lastUrl=e.$$url,e.pollFns=[],e.$$completeOutstandingRequest=t.noop,e.$$incOutstandingRequestCount=t.noop,e.onUrlChange=function(t){return e.pollFns.push(function(){e.$$lastUrl===e.$$url&&e.$$state===e.$$lastState||(e.$$lastUrl=e.$$url,e.$$lastState=e.$$state,t(e.$$url,e.$$state))}),t},e.$$applicationDestroyed=t.noop,e.$$checkUrlChange=t.noop,e.deferredFns=[],e.deferredNextId=0,e.defer=function(t,n){return n=n||0,e.deferredFns.push({time:e.defer.now+n,fn:t,id:e.deferredNextId}),e.deferredFns.sort(function(e,t){return e.time-t.time}),e.deferredNextId++},e.defer.now=0,e.defer.cancel=function(n){var r;return t.forEach(e.deferredFns,function(e,t){e.id===n&&(r=t)}),t.isDefined(r)?(e.deferredFns.splice(r,1),!0):!1},e.defer.flush=function(n){if(t.isDefined(n))e.defer.now+=n;else{if(!e.deferredFns.length)throw new Error("No deferred tasks to be flushed");e.defer.now=e.deferredFns[e.deferredFns.length-1].time}for(;e.deferredFns.length&&e.deferredFns[0].time<=e.defer.now;)e.deferredFns.shift().fn()},e.$$baseHref="/",e.baseHref=function(){return this.$$baseHref}},t.mock.$Browser.prototype={poll:function(){t.forEach(this.pollFns,function(e){e()})},url:function(e,n,r){return t.isUndefined(r)&&(r=null),e?(this.$$url=e,this.$$state=t.copy(r),this):this.$$url},state:function(){return this.$$state},notifyWhenNoOutstandingRequests:function(e){e()}},t.mock.$ExceptionHandlerProvider=function(){var e;this.mode=function(t){switch(t){case"log":case"rethrow":var n=[];e=function(e){if(1==arguments.length?n.push(e):n.push([].slice.call(arguments,0)),"rethrow"===t)throw e},e.errors=n;break;default:throw new Error("Unknown mode '"+t+"', only 'log'/'rethrow' modes are allowed!")}},this.$get=function(){return e},this.mode("rethrow")},t.mock.$LogProvider=function(){function e(e,t,n){return e.concat(Array.prototype.slice.call(t,n))}var n=!0;this.debugEnabled=function(e){return t.isDefined(e)?(n=e,this):n},this.$get=function(){var r={log:function(){r.log.logs.push(e([],arguments,0))},warn:function(){r.warn.logs.push(e([],arguments,0))},info:function(){r.info.logs.push(e([],arguments,0))},error:function(){r.error.logs.push(e([],arguments,0))},debug:function(){n&&r.debug.logs.push(e([],arguments,0))}};return r.reset=function(){r.log.logs=[],r.info.logs=[],r.warn.logs=[],r.error.logs=[],r.debug.logs=[]},r.assertEmpty=function(){var e=[];if(t.forEach(["error","warn","info","log","debug"],function(n){t.forEach(r[n].logs,function(r){t.forEach(r,function(t){e.push("MOCK $log ("+n+"): "+String(t)+"\n"+(t.stack||""))})})}),e.length)throw e.unshift("Expected $log to be empty! Either a message was logged unexpectedly, or an expected log message was not checked and removed:"),e.push(""),new Error(e.join("\n---------\n"))},r.reset(),r}},t.mock.$IntervalProvider=function(){this.$get=["$browser","$rootScope","$q","$$q",function(e,n,r,o){var a=[],i=0,c=0,u=function(u,s,l,d){function f(){if($.notify(p++),l>0&&p>=l){var r;$.resolve(p),t.forEach(a,function(e,t){e.id===v.$$intervalId&&(r=t)}),t.isDefined(r)&&a.splice(r,1)}m?e.defer.flush():n.$apply()}var h=arguments.length>4,g=h?Array.prototype.slice.call(arguments,4):[],p=0,m=t.isDefined(d)&&!d,$=(m?o:r).defer(),v=$.promise;return l=t.isDefined(l)?l:0,v.then(null,null,h?function(){u.apply(null,g)}:u),v.$$intervalId=i,a.push({nextTime:c+s,delay:s,fn:f,id:i,deferred:$}),a.sort(function(e,t){return e.nextTime-t.nextTime}),i++,v};return u.cancel=function(e){if(!e)return!1;var n;return t.forEach(a,function(t,r){t.id===e.$$intervalId&&(n=r)}),t.isDefined(n)?(a[n].deferred.reject("canceled"),a.splice(n,1),!0):!1},u.flush=function(e){for(c+=e;a.length&&a[0].nextTime<=c;){var t=a[0];t.fn(),t.nextTime+=t.delay,a.sort(function(e,t){return e.nextTime-t.nextTime})}return e},u}]};var s=/^(-?\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?:\:?(\d\d)(?:\:?(\d\d)(?:\.(\d{3}))?)?)?(Z|([+-])(\d\d):?(\d\d)))?$/;t.mock.TzDate=function(e,n){var o=new Date(0);if(t.isString(n)){var i=n;if(o.origDate=r(n),n=o.origDate.getTime(),isNaN(n))throw{name:"Illegal Argument",message:"Arg '"+i+"' passed into TzDate constructor is not a valid date string"}}else o.origDate=new Date(n);var c=new Date(n).getTimezoneOffset();o.offsetDiff=60*c*1e3-1e3*e*60*60,o.date=new Date(n+o.offsetDiff),o.getTime=function(){return o.date.getTime()-o.offsetDiff},o.toLocaleDateString=function(){return o.date.toLocaleDateString()},o.getFullYear=function(){return o.date.getFullYear()},o.getMonth=function(){return o.date.getMonth()},o.getDate=function(){return o.date.getDate()},o.getHours=function(){return o.date.getHours()},o.getMinutes=function(){return o.date.getMinutes()},o.getSeconds=function(){return o.date.getSeconds()},o.getMilliseconds=function(){return o.date.getMilliseconds()},o.getTimezoneOffset=function(){return 60*e},o.getUTCFullYear=function(){return o.origDate.getUTCFullYear()},o.getUTCMonth=function(){return o.origDate.getUTCMonth()},o.getUTCDate=function(){return o.origDate.getUTCDate()},o.getUTCHours=function(){return o.origDate.getUTCHours()},o.getUTCMinutes=function(){return o.origDate.getUTCMinutes()},o.getUTCSeconds=function(){return o.origDate.getUTCSeconds()},o.getUTCMilliseconds=function(){return o.origDate.getUTCMilliseconds()},o.getDay=function(){return o.date.getDay()},o.toISOString&&(o.toISOString=function(){return a(o.origDate.getUTCFullYear(),4)+"-"+a(o.origDate.getUTCMonth()+1,2)+"-"+a(o.origDate.getUTCDate(),2)+"T"+a(o.origDate.getUTCHours(),2)+":"+a(o.origDate.getUTCMinutes(),2)+":"+a(o.origDate.getUTCSeconds(),2)+"."+a(o.origDate.getUTCMilliseconds(),3)+"Z"});var u=["getUTCDay","getYear","setDate","setFullYear","setHours","setMilliseconds","setMinutes","setMonth","setSeconds","setTime","setUTCDate","setUTCFullYear","setUTCHours","setUTCMilliseconds","setUTCMinutes","setUTCMonth","setUTCSeconds","setYear","toDateString","toGMTString","toJSON","toLocaleFormat","toLocaleString","toLocaleTimeString","toSource","toString","toTimeString","toUTCString","valueOf"];return t.forEach(u,function(e){o[e]=function(){throw new Error("Method '"+e+"' is not implemented in the TzDate mock")}}),o},t.mock.TzDate.prototype=Date.prototype,t.mock.animate=t.module("ngAnimateMock",["ng"]).config(["$provide",function(e){e.factory("$$forceReflow",function(){function e(){e.totalReflows++}return e.totalReflows=0,e}),e.factory("$$animateAsyncRun",function(){var e=[],t=function(){return function(t){e.push(t)}};return t.flush=function(){if(0===e.length)return!1;for(var t=0;t<e.length;t++)e[t]();return e=[],!0},t}),e.decorator("$$animateJs",["$delegate",function(e){var t=[],n=function(){var n=e.apply(e,arguments);return n&&t.push(n),n};return n.$closeAndFlush=function(){t.forEach(function(e){e.end()}),t=[]},n}]),e.decorator("$animateCss",["$delegate",function(e){var t=[],n=function(n,r){var o=e(n,r);return t.push(o),o};return n.$closeAndFlush=function(){t.forEach(function(e){e.end()}),t=[]},n}]),e.decorator("$animate",["$delegate","$timeout","$browser","$$rAF","$animateCss","$$animateJs","$$forceReflow","$$animateAsyncRun","$rootScope",function(e,n,r,o,a,i,c,u,s){var l={queue:[],cancel:e.cancel,on:e.on,off:e.off,pin:e.pin,get reflows(){return c.totalReflows},enabled:e.enabled,closeAndFlush:function(){this.flush(!0),a.$closeAndFlush(),i.$closeAndFlush(),this.flush()},flush:function(e){s.$digest();var t,n=!1;do t=!1,o.queue.length&&(o.flush(),t=n=!0),u.flush()&&(t=n=!0);while(t);if(!n&&!e)throw new Error("No pending animations ready to be closed or flushed");s.$digest()}};return t.forEach(["animate","enter","leave","move","addClass","removeClass","setClass"],function(t){l[t]=function(){return l.queue.push({event:t,element:arguments[0],options:arguments[arguments.length-1],args:arguments}),e[t].apply(e,arguments)}}),l}])}]),t.mock.dump=function(e){function n(e){var o;return t.isElement(e)?(e=t.element(e),o=t.element("<div></div>"),t.forEach(e,function(e){o.append(t.element(e).clone())}),o=o.html()):t.isArray(e)?(o=[],t.forEach(e,function(e){o.push(n(e))}),o="[ "+o.join(", ")+" ]"):o=t.isObject(e)?t.isFunction(e.$eval)&&t.isFunction(e.$apply)?r(e):e instanceof Error?e.stack||""+e.name+": "+e.message:t.toJson(e,!0):String(e),o}function r(e,n){n=n||"  ";var o=[n+"Scope("+e.$id+"): {"];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&!a.match(/^(\$|this)/)&&o.push("  "+a+": "+t.toJson(e[a]));for(var i=e.$$childHead;i;)o.push(r(i,n+"  ")),i=i.$$nextSibling;return o.push("}"),o.join("\n"+n)}return n(e)},t.mock.$HttpBackendProvider=function(){
this.$get=["$rootScope","$timeout",i]},t.mock.$TimeoutDecorator=["$delegate","$browser",function(e,n){function r(e){var n=[];return t.forEach(e,function(e){n.push("{id: "+e.id+", time: "+e.time+"}")}),n.join(", ")}return e.flush=function(e){n.defer.flush(e)},e.verifyNoPendingTasks=function(){if(n.deferredFns.length)throw new Error("Deferred tasks to flush ("+n.deferredFns.length+"): "+r(n.deferredFns))},e}],t.mock.$RAFDecorator=["$delegate",function(e){var t=function(e){var n=t.queue.length;return t.queue.push(e),function(){t.queue.splice(n,1)}};return t.queue=[],t.supported=e.supported,t.flush=function(){if(0===t.queue.length)throw new Error("No rAF callbacks present");for(var e=t.queue.length,n=0;e>n;n++)t.queue[n]();t.queue=t.queue.slice(n)},t}];var l;t.mock.$RootElementProvider=function(){this.$get=["$injector",function(e){return l=t.element("<div ng-app></div>").data("$injector",e)}]},t.mock.$ControllerDecorator=["$delegate",function(e){return function(n,r,o,a){if(o&&"object"==typeof o){var i=e(n,r,!0,a);return t.extend(i.instance,o),i()}return e(n,r,o,a)}}],t.mock.$ComponentControllerProvider=["$compileProvider",function(e){this.$get=["$controller","$injector",function(e,t){return function(n,r,o,a){var i=t.get(n+"Directive"),c=i.filter(function(e){return e.controller&&e.controllerAs&&"E"===e.restrict});if(0===c.length)throw new Error("No component found");if(c.length>1)throw new Error("Too many components found");var u=c[0];return e(u.controller,r,o,a||u.controllerAs)}}]}],t.module("ngMock",["ng"]).provider({$browser:t.mock.$BrowserProvider,$exceptionHandler:t.mock.$ExceptionHandlerProvider,$log:t.mock.$LogProvider,$interval:t.mock.$IntervalProvider,$httpBackend:t.mock.$HttpBackendProvider,$rootElement:t.mock.$RootElementProvider,$componentController:t.mock.$ComponentControllerProvider}).config(["$provide",function(e){e.decorator("$timeout",t.mock.$TimeoutDecorator),e.decorator("$$rAF",t.mock.$RAFDecorator),e.decorator("$rootScope",t.mock.$RootScopeDecorator),e.decorator("$controller",t.mock.$ControllerDecorator)}]),t.module("ngMockE2E",["ng"]).config(["$provide",function(e){e.decorator("$httpBackend",t.mock.e2e.$httpBackendDecorator)}]),t.mock.e2e={},t.mock.e2e.$httpBackendDecorator=["$rootScope","$timeout","$delegate","$browser",i],t.mock.$RootScopeDecorator=["$delegate",function(e){function t(){for(var e,t=0,n=[this.$$childHead];n.length;)for(e=n.shift();e;)t+=1,n.push(e.$$childHead),e=e.$$nextSibling;return t}function n(){for(var e,t=this.$$watchers?this.$$watchers.length:0,n=[this.$$childHead];n.length;)for(e=n.shift();e;)t+=e.$$watchers?e.$$watchers.length:0,n.push(e.$$childHead),e=e.$$nextSibling;return t}var r=Object.getPrototypeOf(e);return r.$countChildScopes=t,r.$countWatchers=n,e}],!function(r){function o(){this.shared=!1,this.sharedError=null,this.cleanupAfterEach=function(){return!this.shared||this.sharedError}}if(r){var a=null,i=new o,c=[],s=function(){return!!a};t.mock.$$annotate=t.injector.$$annotate,t.injector.$$annotate=function(e){return"function"!=typeof e||e.$inject||c.push(e),t.mock.$$annotate.apply(this,arguments)};var d=e.module=t.mock.module=function(){function e(){if(a.$injector)throw new Error("Injector already created, can not register a module!");var e,r=a.$modules||(a.$modules=[]);t.forEach(n,function(n){e=t.isObject(n)&&!t.isArray(n)?["$provide",function(e){t.forEach(n,function(t,n){e.value(n,t)})}]:n,a.$providerInjector?a.$providerInjector.invoke(e):r.push(e)})}var n=Array.prototype.slice.call(arguments,0);return s()?e():e};d.$$beforeAllHook=e.before||e.beforeAll,d.$$afterAllHook=e.after||e.afterAll,d.$$currentSpec=function(e){return 0===arguments.length?e:void(a=e)},d.sharedInjector=function(){if(!d.$$beforeAllHook||!d.$$afterAllHook)throw Error("sharedInjector() cannot be used unless your test runner defines beforeAll/afterAll");var e=!1;d.$$beforeAllHook(function(){if(i.shared)throw i.sharedError=Error("sharedInjector() cannot be called inside a context that has already called sharedInjector()"),i.sharedError;e=!0,a=this,i.shared=!0}),d.$$afterAllHook(function(){e?(i=new o,d.$$cleanup()):i.sharedError=null})},d.$$beforeEach=function(){if(i.shared&&a&&a!=this){var e=a;a=this,t.forEach(["$injector","$modules","$providerInjector","$injectorStrict"],function(t){a[t]=e[t],e[t]=null})}else a=this,l=null,c=[]},d.$$afterEach=function(){i.cleanupAfterEach()&&d.$$cleanup()},d.$$cleanup=function(){var e=a.$injector;if(c.forEach(function(e){delete e.$inject}),t.forEach(a.$modules,function(e){e&&e.$$hashKey&&(e.$$hashKey=n)}),a.$injector=null,a.$modules=null,a.$providerInjector=null,a=null,e){var r=e.get("$rootElement"),o=r&&r[0],i=l?[l[0]]:[];!o||l&&o===l[0]||i.push(o),t.element.cleanData(i);var s=e.get("$rootScope");s&&s.$destroy&&s.$destroy()}t.forEach(t.element.fragments,function(e,n){delete t.element.fragments[n]}),u.$$lastInstance=null,t.forEach(t.callbacks,function(e,n){delete t.callbacks[n]}),t.callbacks.counter=0},(e.beforeEach||e.setup)(d.$$beforeEach),(e.afterEach||e.teardown)(d.$$afterEach);var f=function(e,t){this.message=e.message,this.name=e.name,e.line&&(this.line=e.line),e.sourceId&&(this.sourceId=e.sourceId),e.stack&&t&&(this.stack=e.stack+"\n"+t.stack),e.stackArray&&(this.stackArray=e.stackArray)};f.prototype.toString=Error.prototype.toString,e.inject=t.mock.inject=function(){function e(){var e=a.$modules||[],o=!!a.$injectorStrict;e.unshift(["$injector",function(e){a.$providerInjector=e}]),e.unshift("ngMock"),e.unshift("ng");var i=a.$injector;i||(o&&t.forEach(e,function(e){"function"==typeof e&&t.injector.$$annotate(e)}),i=a.$injector=t.injector(e,o),a.$injectorStrict=o);for(var c=0,u=n.length;u>c;c++){a.$injectorStrict&&i.annotate(n[c]);try{i.invoke(n[c]||t.noop,this)}catch(s){if(s.stack&&r)throw new f(s,r);throw s}finally{r=null}}}var n=Array.prototype.slice.call(arguments,0),r=new Error("Declaration Location");return s()?e.call(a):e},t.mock.inject.strictDi=function(e){function t(){if(e!==a.$injectorStrict){if(a.$injector)throw new Error("Injector already created, can not modify strict annotations");a.$injectorStrict=e}}return e=arguments.length?!!e:!0,s()?t():t}}}(e.jasmine||e.mocha)}(window,window.angular);