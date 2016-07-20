/*
* xiuno.js 4.0，命名空间放弃 window（容易冲突），默认使用 xn.
*/

/********************* 对 window 对象进行扩展 ************************/

// 兼容 ie89
if(!Object.keys) {
	Object.keys = function(o) {
		var arr = [];
		for(var k in o) {
			if(o.hasOwnProperty(k)) arr.push(o[k]);
		}
		return arr;
	}
}
Object.first = function(obj) {
	for(var k in obj) return obj[k];
}
Object.length = function(obj) {
	var n = 0;
	for(var k in obj) n++;
	return n;
}
Object.count = function(obj) {
	if(!obj) return 0;
	if(obj.length) return obj.length;
	var n = 0;
	for(k in obj) {
		if(obj.hasOwnProperty(k)) n++;
	}
	return n;
}
Object.sum = function(obj) {
	var sum = 0;
	$.each(obj, function(k, v) {sum += intval(v)});
	return sum;
}

if(typeof console == 'undefined') {
	console = {};
	console.log = function() {};
}

/********************* xn 模拟 php 函数 ************************/

//var xn = window; // browser， 如果要兼容以前的版本，请开启这里。
//var xn = global; // nodejs
var xn = {};	  // 避免冲突

// 针对国内的山寨套壳浏览器检测不准确
xn.is_ie = (!!document.all) ? true : false;// ie6789
xn.is_ie_10 = navigator.userAgent.indexOf('Trident') != -1;
xn.is_ff = navigator.userAgent.indexOf('Firefox') != -1;
xn.webgl = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();
xn.canvas = !!window.CanvasRenderingContext2D;
xn.in_mobile = ($(window).width() < 1140) ? true : false;

xn.htmlspecialchars = function(s) {
	s = s.replace('<', "&lt;");
	s = s.replace('>', "&gt;");
	return s;
}

xn.urlencode = function(s) {
	s = encodeURIComponent(s);
	s = xn.strtolower(s);
	return s;
}

xn.urldecode = function(s) {
	s = decodeURIComponent(s);
	return s;
}

xn.urlencode_safe = function(s) {
	s = encodeURIComponent(s);
	s = s.replace(/_/g, "%5f");
	s = s.replace(/\-/g, "%2d");
	s = s.replace(/\./g, "%2e");
	s = s.replace(/\~/g, "%7e");
	s = s.replace(/\!/g, "%21");
	s = s.replace(/\*/g, "%2a");
	s = s.replace(/\(/g, "%28");
	s = s.replace(/\)/g, "%29");
	s = s.replace(/\%/g, "_");
	return s;
}

xn.urldecode_safe = function(s) {
	s = s.replace('_', "%");
	s = decodeURIComponent(s);
	return s;
}

// 兼容 3.0
xn.xn_urlencode = xn.urlencode_safe;
xn.xn_urldecode = xn.urldecode_safe;

xn.nl2br = function(s) {
	s = s.replace("\r\n", "\n");
	s = s.replace("\n", "<br>");
	s = s.replace("\t", "&nbsp; &nbsp; &nbsp; &nbsp; ");
	return s;
}

xn.time = function() {
	return xn.intval(Date.now() / 1000);
}

xn.intval = function(s) {
	var i = parseInt(s);
	return isNaN(i) ? 0 : i;
}

xn.floatval = function(s) {
    if(!s) return 0;
    if(s.constructor === Array) {
        for(var i=0; i<s.length; i++) {
            s[i] = xn.floatval(s[i]);
        }
        return s;
    }
    var r = parseFloat(s);
    return isNaN(r) ? 0 : r;
}

xn.isset = function(k) {
	var t = typeof k;
	return t != 'undefined' && t != 'unknown';
}

xn.empty = function(s) {
	if(s == '0') return true;
	if(!s) {
		return true;
	} else {
		//$.isPlainObject
		if(s.constructor === Object) {
			return Object.keys(s).length == 0;
		} else if(s.constructor === Array) {
			return s.length == 0;
		}
		return false;
	}
}

xn.ceil = Math.ceil;
xn.round = Math.round;
xn.floor = Math.floor;
xn.f2y = function(i, callback) {
	if(!callback) callback = round;
	var r = i / 100;
	return callback(r);
}
xn.y2f = function(s) {
	var r = xn.round(xn.intval(s) * 100);
	return r;
}
xn.strtolower = function(s) {
	s += '';
	return s.toLowerCase();
}

xn.json_type = function(o) {
	var _toS = Object.prototype.toString;
	var _types = {
		'undefined': 'undefined',
		'number': 'number',
		'boolean': 'boolean',
		'string': 'string',
		'[object Function]': 'function',
		'[object RegExp]': 'regexp',
		'[object Array]': 'array',
		'[object Date]': 'date',
		'[object Error]': 'error'
	};
	return _types[typeof o] || _types[_toS.call(o)] || (o ? 'object' : 'null');
};

xn.json_encode = function(o) {
	var json_replace_chars = function(chr) {
		var specialChars = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };
		return specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
	};

	var s = [];
	switch (xn.json_type(o)) {
		case 'undefined':
			return 'undefined';
			break;
		case 'null':
			return 'null';
			break;
		case 'number':
		case 'boolean':
		case 'date':
		case 'function':
			return o.toString();
			break;
		case 'string':
			return '"' + o.replace(/[\x00-\x1f\\"]/g, json_replace_chars) + '"';
			break;
		case 'array':
			for (var i = 0, l = o.length; i < l; i++) {
				s.push(xn.json_encode(o[i]));
			}
			return '[' + s.join(',') + ']';
			break;
		case 'error':
		case 'object':
			for (var p in o) {
				s.push('"' + p + '"' + ':' + xn.json_encode(o[p]));
			}
			return '{' + s.join(',') + '}';
			break;
		default:
			return '';
			break;
	}
};

xn.json_decode = function(s) {
	if(!s) return null;
	try {
		// 去掉广告代码。这行代码挺无语的，为了照顾国内很多人浏览器中广告病毒的事实。
		// s = s.replace(/\}\s*<script[^>]*>[\s\S]*?<\/script>\s*$/ig, '}');
		if(s.match(/^<!DOCTYPE/i)) return null;
		var json = $.parseJSON(s);
		return json;
	} catch(e) {
		//alert('JSON格式错误：' + s);
		//window.json_error_string = s;	// 记录到全局
		return null;
	}
}

// 方便移植 PHP 代码
xn.min = function() {return Math.min.apply(this, arguments);}
xn.max = function() {return Math.max.apply(this, arguments);}
xn.str_replace = function(s, d, str) {return str.replace(s, d);}
xn.strrpos = function(str, s) {return str.lastIndexOf(s);}
xn.strpos = function(str, s) {return str.indexOf(s);}
xn.substr = function(str, start, len) {
	// 支持负数
	var end = length;
	var length = str.length;
	if(start < 0) start = length + start;
	if(!len) {
		end = length;
	} else if(len > 0) {
		end = start + len;
	} else {
		end = length + len;
	}
	return str.substring(start, end);
}
xn.explode = function(sep, s) {return s.split(sep);}
xn.implode = function(glur, arr) {return arr.join(glur);}
xn.array_merge = function(arr1, arr2) {return arr1 && arr1.__proto__ === Array.prototype && arr2 && arr2.__proto__ === Array.prototype ? arr1.concat(arr2) : $.extend(arr1, arr2);}
// 比较两个数组的差异，在 arr1 之中，但是不在 arr2 中。返回差异结果集的新数组，
xn.array_diff = function(arr1, arr2) {
	if(arr1.__proto__ === Array.prototype) {
		var o = {};
		for(var i = 0, len = arr2.length; i < len; i++) o[arr2[i]] = true;
		var r = [];
		for(i = 0, len = arr1.length; i < len; i++) {
			var v = arr1[i];
			if(o[v]) continue;
			r.push(v);
		}
		return r;
	} else {
		var r = {};
		for(k in arr1) {
			if(!arr2[k]) r[k] = arr1[k];
		}
		return r;
	}
}

// 所谓的 js 编译模板，不过是一堆效率低下的正则替换，这种东西根据自己喜好用吧。
xn.template = function(s, json) {
	//console.log(json);
	for(k in json) {
		var r = new RegExp('\{('+k+')\}', 'g');
		s = s.replace(r, function(match, name) {
			return json[name];
		});
	}
	return s;
}

xn.is_mobile = function(s) {
	var r = /^\d{11}$/;
	if(!s) {
		return false;
	} else if(!r.test(s)) {
		return false;
	}
	return true;
}

xn.is_email = function(s) {
	var r = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/i
	if(!s) {
		return false;
	} else if(!r.test(s)) {
		return false;
	}
	return true;
}

xn.is_element = function(obj) {
    return !!(obj && obj.nodeType === 1);
};

/* 
	js 版本的翻页函数
*/
// 用例：pages('user-list-{page}.htm', 100, 10, 5);
xn.pages = function (url, totalnum, page, pagesize) {
	if(!page) page = 1;
	if(!pagesize) pagesize = 20;
	var totalpage = xn.ceil(totalnum / pagesize);
	if(totalpage < 2) return '';
	page = xn.min(totalpage, page);
	var shownum = 5;	// 显示多少个页 * 2

	var start = xn.max(1, page - shownum);
	var end = xn.min(totalpage, page + shownum);

	// 不足 $shownum，补全左右两侧
	var right = page + shownum - totalpage;
	if(right > 0) start = xn.max(1, start -= right);
	left = page - shownum;
	if(left < 0) end = xn.min(totalpage, end -= left);

	var s = '';
	if(page != 1) s += '<a href="'+xn.str_replace('{page}', page-1, url)+'">◀</a>';
	if(start > 1) s += '<a href="'+xn.str_replace('{page}', 1, url)+'">1 '+(start > 2 ? '... ' : '')+'</a>';
	for(i=start; i<=end; i++) {
		if(i == page) {
			s += '<a href="'+xn.str_replace('{page}', i, url)+'" class="active">'+i+'</a>';// active
		} else {
			s += '<a href="'+xn.str_replace('{page}', i, url)+'">'+i+'</a>';
		}
	}
	if(end != totalpage) s += '<a href="'+xn.str_replace('{page}', totalpage, url)+'">'+(totalpage - end > 1 ? '... ' : '')+totalpage+'</a>';
	if(page != totalpage) s += '<a href="'+xn.str_replace('{page}', page+1, url)+'">▶</a>';
	return s;
}

xn.parse_url = function(url) {
	if(url.match(/^(([a-z]+):)\/\//i)) {
		var arr = url.match(/^(([a-z]+):\/\/)?([^\/\?#]+)\/*([^\?#]*)\??([^#]*)#?(\w*)$/i);
		if(!arr) return null;
		var r = {
		    'schema': arr[2],
		    'host': arr[3],
		    'path': arr[4],
		    'query': arr[5],
		    'anchor': arr[6],
		    'requesturi': arr[4] + (arr[5] ? '?'+arr[5] : '') + (arr[6] ? '#'+arr[6] : '')
		};
		console.log(r);
		return r;
	} else {
		
		var arr = url.match(/^([^\?#]*)\??([^#]*)#?(\w*)$/i);
		if(!arr) return null;
		var r = {
		    'schema': '',
		    'host': '',
		    'path': arr[1],
		    'query': arr[2],
		    'anchor': arr[3],
		    'requesturi': arr[1] + (arr[2] ? '?'+arr[2] : '')  + (arr[3] ? '#'+arr[3] : '')
		};
		console.log(r);
		return r;
	}
}

xn.parse_str = function (str){
	var sep1 = '=';
	var sep2 = '&';
	var arr = str.split(sep2);
	var arr2 = {};
	for(var x=0; x < arr.length; x++){
		var tmp = arr[x].split(sep1);
		arr2[unescape(tmp[0])] = unescape(tmp[1]).replace(/[+]/g, ' ');
	}
	return arr2;
}

// 解析 url 参数获取 $_GET 变量
xn.parse_url_param = function(url) {
	var arr = xn.parse_url(url);
	var q = arr.path;
	var pos = xn.strrpos(q, '/');
	q = xn.substr(q, pos + 1);
	var r = [];
	if(xn.substr(q, -4) == '.htm') {
		q = xn.substr(q, 0, -4);
		r = xn.explode('-', q);
	// 首页
	} else if (url && url != window.location && url != '.' && url != '/' && url != './'){
		r = ['thread', 'seo', url];
	}

	// 将 xxx.htm?a=b&c=d 后面的正常的 _GET 放到 $_SERVER['_GET']
	if(!empty(arr['query'])) {
		var arr2 = xn.parse_str(arr['query']);
		r = xn.array_merge(r, arr2);
	}
	return r;
}

// 从参数里获取数据
xn.param = function(key) {

}

// 模拟服务端 url() 函数
xn.url = function(u, url_rewrite_on) {
	if(!url_rewrite_on) url_rewrite_on = 0;
	if(url_rewrite_on == 0) {
		u = "?"+u+".htm";
	} else if(url_rewrite_on == 1) {
		u = u + ".htm";
	} else if(url_rewrite_on == 2) {
		u = xn.str_replace('-', '/', u);
		u = "?"+u;
	} else if(url_rewrite_on == 3) {
		u = xn.str_replace('-', '/', u);
	}
	return u;
}

// 页面跳转的时间
//xn.jumpdelay = xn.debug ? 20000000 : 2000;


/********************* 对 JQuery 进行扩展 ************************/

$.location = function(url, seconds) {
	if(seconds === undefined) seconds = 1;
	setTimeout(function() {window.location='./';}, seconds * (debug ? 1000000 : 1000));
}

// 二级数组排序
/*var first = function(obj) {for(var k in obj) return k;}
Array.prototype.proto_sort = Array.prototype.sort;
Array.prototype.sort = function(arg) {
	if(arg === undefined) {
		return this.proto_sort();
	} else if(arg.constructor === Function) {
		return this.proto_sort(arg);
	} else if(arg.constructor === Object) {
		var k = first(arg);
		var v = arg[k];
		return this.proto_sort(function(a, b) {return v == 1 ? a[k] > b[k] : a[k] < b[k];});
	} else {
		return this;
	}
}*/
// var arrlist = [{id:1, name:"zhangsan"}, {id:2, name:"lisi"}];
// arrlist.sort(function(a, b) {a.name > b.name});
// arrlist.sort({name:1});
// console.log(arrlist);

if(xn.is_ie) document.documentElement.addBehavior("#default#userdata");

$.pdata = function(key, value) {
	var r = '';
	if(typeof value != 'undefined') {
		value = xn.json_encode(value);
	}

	// HTML 5
	try {
		// ie10 需要 try 一下
		if(window.localStorage){
			if(typeof value == 'undefined') {
				r = localStorage.getItem(key);
				return xn.json_decode(r);
			} else {
				return localStorage.setItem(key, value);
			}
		}
	} catch(e) {}

	// HTML 4
	if(xn.is_ie && (!document.documentElement || typeof document.documentElement.load == 'unknown' || !document.documentElement.load)) {
		return '';
	}
	// get
	if(typeof value == 'undefined') {
		if(xn.is_ie) {
			try {
				document.documentElement.load(key);
				r = document.documentElement.getAttribute(key);
			} catch(e) {
				//alert('$.pdata:' + e.message);
				r = '';
			}
		} else {
			try {
				r = sessionStorage.getItem(key) && sessionStorage.getItem(key).toString().length == 0 ? '' : (sessionStorage.getItem(key) == null ? '' : sessionStorage.getItem(key));
			} catch(e) {
				r = '';
			}
		}
		return xn.json_decode(r);
	// set
	} else {
		if(xn.is_ie){
			try {
				// fix: IE TEST for ie6 崩溃
				document.documentElement.load(key);
				document.documentElement.setAttribute(key, value);
				document.documentElement.save(key);
				return  document.documentElement.getAttribute(key);
			} catch(error) {/*alert('setdata:'+error.message);*/}
		} else {
			try {
				return sessionStorage.setItem(key, value);
			} catch(error) {/*alert('setdata:'+error.message);*/}
		}
	}
};


// time 单位为秒，与php setcookie, 和  misc::setcookie() 的 time 参数略有差异。
$.cookie = function(name, value, time, path) {
	if(typeof value != 'undefined') {
		if (value === null) {
			var value = '';
			var time = -1;
		}
		if(typeof time != 'undefined') {
			date = new Date();
			date.setTime(date.getTime() + (time * 1000));
			var time = '; expires=' + date.toUTCString();
		} else {
			var time = '';
		}
		var path = path ? '; path=' + path : '';
		//var domain = domain ? '; domain=' + domain : '';
		//var secure = secure ? '; secure' : '';
		document.cookie = name + '=' + encodeURIComponent(value) + time + path;
	} else {
		var v = '';
		if(document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for(var i = 0; i < cookies.length; i++) {
				var cookie = $.trim(cookies[i]);
				if(cookie.substring(0, name.length + 1) == (name + '=')) {
					v = decodeURIComponent(cookie.substring(name.length + 1)) + '';
					break;
				}
			}
		}
		return v;
	}
};


// 改变Location URL ?
$.xget = function(url, callback, retry) {
	if(retry === undefined) retry = 1;
	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'text',
		timeout: 15000,
		success: function(r){
			if(!r) return callback(-100, 'Server Response Empty!');
			var s = xn.json_decode(r);
			if(!s) {
				return callback(-101, r); // 'Server Response xn.json_decode() failed：'+
			}
			if(s.code === undefined) {
				if($.isPlainObject(s)) {
					return callback(0, s);
				} else {
					return callback(-102, r); // 'Server Response Not JSON 2：'+
				}
			} else if(s.code == 0) {
				return callback(0, s.message);
			//系统错误
			} else if(s.code < 0) {
				return callback(s.code, s.message);
			//业务逻辑错误
			} else {
				return callback(s.code, s.message);
			
			}
		},
		// 网络错误，重试
		error: function(xhr, type) {
			if(retry > 1) {
				$.xget(url, callback, retry - 1);
			} else {
				if((type != 'abort' && type != 'error') || xhr.status == 403 || xhr.status == 404) {
					return callback(-1000, "xhr.responseText:"+xhr.responseText+', type:'+type);
				} else {
					return callback(-1001, "xhr.responseText:"+xhr.responseText+', type:'+type);
					console.log("xhr.responseText:"+xhr.responseText+', type:'+type);
				}
			}
		}
	});
}

$.xpost = function(url, postdata, callback) {
	if($.isFunction(postdata)) {
		callback = postdata;
		postdata = null;
	}
	
	$.ajax({
		type: 'POST',
		url: url,
		data: postdata,
		dataType: 'text',
		timeout: 60000,
		success: function(r){
			if(!r) return callback(-1, 'Server Response Empty!');
			var s = xn.json_decode(r);
			if(!s || s.code === undefined) return callback(-1, 'Server Response Not JSON：'+r);
			if(s.code == 0) {
				return callback(0, s.message);
			//系统错误
			} else if(s.code < 0) {
				return callback(s.code, s.message);
			} else {
				return callback(s.code, s.message);
			}
		},
		error: function(xhr, type) {
			if(type != 'abort' && type != 'error' || xhr.status == 403) {
				return callback(-1000, "xhr.responseText:"+xhr.responseText+', type:'+type);
			} else {
				return callback(-1001, "xhr.responseText:"+xhr.responseText+', type:'+type);
				console.log("xhr.responseText:"+xhr.responseText+', type:'+type);
			}
		}
	});
}

/*
	异步转同步的方式执行 ajax 请求
	用法：
	$.xget_sync(['1.htm', 'index.htm', '3.htm'], function(code, message, i){
		console.log(i+', code:'+code);
	}, function(code, message) {
		console.log();
	});
*/
$.xget_sync = function(urlarr, once_callback, complete_callback) {
	var arr = [];
	for(var i=0; i<urlarr.length; i++) {
		+function(i) {
			var url = urlarr[i];
			arr.push(function(callback) {
				$.xget(url, function(code, message) {
					once_callback(code, message, i);
					callback(null, {code:code, message:message});
				});
			});
		}(i);
	};
	async.series(arr, function(err, result) {
		if(err) {
			complete_callback(-1, result);
		} else {
			complete_callback(0, result);
		}
	});
}

$.xpost_sync = function(urlarr, postdataarr, once_callback, complete_callback) {
	var arr = [];
	for(var i=0; i<urlarr.length; i++) {
		var url = urlarr[i];
		var postdata = postdataarr[i];
		+function(i, url, postdata, once_callback) {
			arr.push(function(callback) {
				$.xpost(url, postdata, function(code, message) {
					once_callback(code, message, i);
					callback(null, {code:code, message:message});
				});
			});
		}(i, url, postdata, once_callback);
	}
	async.series(arr, function(err, result) {
		if(err) {
			complete_callback(-1, result);
		} else {
			complete_callback(0, result);
		}
	});
}

/*
	功能：
		异步加载 js, 加载成功以后 callback
	用法：
		$.require('1.js', '2.js', function() {
			alert('after all loaded');
		});
		$.require(['1.js', '2.js'] function() {
			alert('after all loaded');
		});
*/
// 区别于全局的 node.js require 关键字
$.required = [];
$.require = function() {
	var args = null;
	if(arguments[0] && typeof arguments[0] == 'object') { // 如果0 为数组
		args = arguments[0];
		if(arguments[1]) args.push(arguments[1]);
	} else {
		args = arguments;
	}
	this.load = function(args, i) {
		var _this = this;
		if(args[i] === undefined) return;
		if(typeof args[i] == 'string') {
			var js = args[i];
			// 避免重复加载
			if($.inArray(js, $.required) != -1) {
				if(i < args.length) this.load(args, i+1);
				return;
			}
			$.required.push(js);
			var script = document.createElement("script");
			script.src = js;
			script.onerror = function() {
				console.log('script load error:'+js);
				_this.load(args, i+1);
			}
			if(xn.is_ie) {
				script.onreadystatechange = function() {
					if(script.readyState == 'loaded' || script.readyState == 'complete') {
						_this.load(args, i+1);
						script.onreadystatechange = null;
					}
				};
			} else {
				script.onload = function() { _this.load(args, i+1); };
			}
			document.getElementsByTagName('head')[0].appendChild(script);
		} else if(typeof args[i] == 'function'){
			var f = args[i];
			f();
			if(i < args.length) this.load(args, i+1);
		} else {
			_this.load(args, i+1);
		}
	};
	this.load(args, 0);
}

$.require_css = function(filename) {
	// 判断重复加载
	var tags = document.getElementsByTagName('link');
	for(var i=0; i<tags.length; i++) {
		if(tags[i].href.indexOf(filename) != -1) {
			return false;
		}
	}
	
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = filename;
	document.getElementsByTagName('head')[0].appendChild(link);
}

// 在节点上显示 loading 图标
$.fn.loading = function(action) {
	return this.each(function() {
		var jthis = $(this);
		jthis.css('position', 'relative');
		if(!this.jloading) this.jloading = $('<div class="loading"><img src="static/loading.gif" /></div>').appendTo(jthis);
		var jloading = this.jloading.show();
		if(!action) {
			var offset = jthis.position();
			var left = offset.left;
			var top = offset.top;
			var w = jthis.width();
			var h = xn.min(jthis.height(), $(window).height());
			var left = w / 2 - jloading.width() / 2;
			var top = (h / 2 -  jloading.height() / 2) * 2 / 3;
			jloading.css('position', 'absolute').css('left', left).css('top', top);
		} else if(action == 'close') {
			jloading.remove();
			this.jloading = null;
		}
	});
}

// 获取所有的 父节点集合，一直到最顶层节点为止。, IE8 没有 HTMLElement
xn.nodeHasParent = function(node, topNode) {
	if(!topNode) topNode = document.body;
	var pnode = node.parentNode;
	while(pnode) {
		if(pnode == topNode) return true;
		pnode = pnode.parentNode;
	};
	return false;
}

// 表单提交碰到错误的时候，依赖此处，否则错误会直接跳过，不利于发现错误
window.onerror = function(msg, url, line) {
	if(!debug) return;
	alert("error: "+msg+"\r\n line: "+line+"\r\n url: "+url);
	// 阻止所有的 form 提交动作
	return false;
}

// remove() 并不清除子节点事件！！用来替代 remove()，避免内存泄露
$.fn.removeDeep = function() {
	 this.each(function() {
		$(this).find('*').off();
	});
	this.off();
	this.remove();
	return this;
}

// empty 清楚子节点事件，释放内存。
$.fn.emptyDeep = function() {
	this.each(function() {
		$(this).find('*').off();
	});
	this.empty();
	return this;
}

$.fn.son = $.fn.children;

/*
	用来选中和获取 select radio checkbox 的值，用法：
	$('#select1').checked(1);			// 设置 value="1" 的 option 为选中状态
	$('#select1').checked();			// 返回选中的值。
	$('input[type="checkbox"]').checked([2,3,4]);	// 设置 value="2" 3 4 的 checkbox 为选中状态
	$('input[type="checkbox"]').checked();		// 获取选中状态的 checkbox 的值，返回 []
	$('input[type="radio"]').checked(2);		// 设置 value="2" 的 radio 为选中状态
	$('input[type="radio"]').checked();		// 返回选中状态的 radio 的值。
*/
$.fn.checked = function(v) {
	// 转字符串
	if(v) v = v instanceof Array ? v.map(function(vv) {return vv+""}) : v + "";
	var filter = function() {return !(v instanceof Array) ? (this.value == v) : ($.inArray(this.value, v) != -1)};
	// 设置
	if(v) {
		this.each(function() {
			if(xn.strtolower(this.tagName) == 'select') {
				$(this).find('option').filter(filter).prop('selected', true);
			} else if(xn.strtolower(this.type) == 'checkbox' || strtolower(this.type) == 'radio') {
				// console.log(v);
				$(this).filter(filter).prop('checked', true);
			}
		});
		return this;
	// 获取，值用数组的方式返回
	} else {
		if(this.length <= 0) return [];
		var tagtype = xn.strtolower(this[0].tagName) == 'select' ? 'select' : xn.strtolower(this[0].type);
		var r = (tagtype == 'checkbox' ? [] : '');
		for(var i=0; i<this.length; i++) {
			var tag = this[i];
			if(tagtype == 'select') {
				var joption = $(tag).find('option').filter(function() {return this.selected == true});
				if(joption.length > 0) return joption.attr('value');
			} else if(tagtype == 'checkbox') {
				if(tag.checked) r.push(tag.value);
			} else if(tagtype == 'radio') {
				if(tag.checked) return tag.value;
			}
		}
		return r;
	}
}

$.fn.button = function(status) {
	return this.each(function() {
		var jthis = $(this);
		var loading_text = jthis.attr('loading-text') || jthis.data('loading-text');
		if(status == 'loading') {
			jthis.prop('disabled', true).addClass('disabled').attr('default-text', jthis.text());
			jthis.html(loading_text);
		} else if(status == 'disabled') {
			jthis.prop('disabled', true).addClass('disabled');
		} else if(status == 'enable') {
			jthis.prop('disabled', false).removeClass('disabled');
		} else if(status == 'reset') {
			jthis.prop('disabled', false).removeClass('disabled');
			if(jthis.attr('default-text')) {
				jthis.text(jthis.attr('default-text'));
			}
		} else {
			jthis.text(status);
		}
	});
}

// 在控件上方提示错误信息，如果为手机版，则调用 toast
$.fn.alert = function(message) {
	var jthis = $(this);
	jpthis = jthis.parent('.form-group');
	jpthis.addClass('has-danger');
	jthis.addClass('form-control-danger');
	//if(in_mobile) alert(message);
	jthis.data('title', message).tooltip('show');
	return this;
}

$.fn.serializeObject = function() {
	var formobj = {};
	$([].slice.call(this.get(0).elements)).each(function() {
		var jthis = $(this);
		var type = jthis.attr('type');
		var name = jthis.attr('name');
		if (name && xn.strtolower(this.nodeName) != 'fieldset' && !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
		((type != 'radio' && type != 'checkbox') || this.checked)) {
			// 还有一些情况没有考虑, 比如: hidden 或 text 类型使用 name 数组时
			if(type == 'radio' || type == 'checkbox') {
				if(!formobj[name]) formobj[name] = [];
				formobj[name].push(jthis.val());
			}else{
				formobj[name] = jthis.val();
			}
		}
	})
	return formobj;
}