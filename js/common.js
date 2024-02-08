var gl_pz_user, gl_pz_server, gl_pz_pwd;
var loading_timer, loading_timer2, loading_timer3;
var table = [];

var agt = navigator.userAgent.toLowerCase();
var is_ie = (agt.indexOf("msie") != -1&&agt.indexOf('opera')==-1);
if (is_ie) {
	location = "login/stop.htm";
}

function statusShow(d) {
	if(d) {
		var r = JSON.parse(d);
		if(r.result) {
			var el = $("<div class='status'>");
			if(r.result && r.result == 'success') {$(el).addClass("success").html("Выполнено");}
			if(r.result && r.result == 'error') {$(el).addClass("error").html("Ошибка");}
			if(r.message) {
				$(el).append("<br /><span>"+r.message+"</span>");
			}
			$("#status_list").append(el);
			setTimeout(function(){$(el).fadeOut(300);}, 4000);
			if(r.warnings) {
				var el_w = [];
				for(i=0; i<r.warnings.length; i++) {
					el_w[i] = $("<div class='status'>");
					$("#status_list").append(el_w[i]);
					$(el_w[i]).addClass("warning").html("<span>"+r.warnings[i]+"</span>");
				}
				setTimeout(function(){
					for(i=0; i<r.warnings.length; i++) {
						$(el_w[i]).fadeOut(300);
					}
				}, 4000);
			}
		}
	}
}

function statusType(t,m) {
	var d = {};
	d['result'] = t;
	d['message'] = m;
	statusShow(JSON.stringify(d));
}

function loadingShow() {
	clearTimeout(loading_timer);
	clearTimeout(loading_timer2);
	clearTimeout(loading_timer3);
	$("#wait div").html("Загрузка...").css('width','100px'); $("#wait").show();
	loading_timer2 = setTimeout(function() {$("#wait div").html("Для выполнения вашего запроса требуется чуть больше времени...").css('width','500px');}, 6000);
	loading_timer3 = setTimeout(function() {loadingHide();}, 12000);
}

function loadingHide() {
	$("#wait").hide();
	clearTimeout(loading_timer);
	clearTimeout(loading_timer2);
	clearTimeout(loading_timer3);
}

function post(url, str, cb) {
	if(url) {
		$.post(url, str, function result(data) {if(cb) {cb(data);}});
	}
}

function parseData(d,id) {
	if(d) {return JSON.parse(d);}
}

function menu(loc, upd, par) {
	if(loc != "") {
		if(loc == "front" && upd != "front") {
			if(front_clear) {
				billBasketClear();
			} else {
				//if($("#"+loc).is(':visible')) {billBasketClear();}
			}
		}
		$("#main").children().hide();
		$("#"+loc).show();
	}
	if($("#"+loc).html() == "") {upd = loc;}
	if(upd != "") {
		if(!par) {par="";}
		if(upd == "square" && par == "orders=") {par = $("#map_button").attr("info")+"&orders=";}
		if(upd != "orders" && upd != "front") {
			loadingShow();
			$.post("main/"+upd+".php",par,
				function result(data) {
					$("#"+upd).html(data);
					if(ca && upd == "cashbox") {$("#print_cash_x_block").append("<span class='btn grey print' onclick=\"cx();\" id='noprint'><span></span>X отчет</span>");}
					loadingHide();
				}
			);
		}
		if(upd == "orders") {
			ordersList();
		}
		if(upd == "front") {
			if(par = "front_update") {$("#frontContent").html("");}
			frontProductAffiliateSelect();
		}
	} else {
		$("#wait2").show();
		setTimeout(function() {$("#wait2").hide();}, 120);
	}
}

function frontLoad(str) {
	loadingShow();
	$.post("blocks/content/front_list.php", str,
		function result(data) {
			if(data) {
				$("#frontContent").append(data);
				loadingHide();
			} else {
				loadingHide();
			}
		}
	);
}

function frontProductAffiliateSelect() {
	var objChild = document.getElementById("frontContent").childNodes;
	for (var i = 0; i < objChild.length; i++) {
		if(objChild[i].id) {
			$("#"+objChild[i].id).hide();
		}
	}
	if($("#billPoint option:selected").val()) {
		var a = $("#billPoint option:selected").val().split(',');
	} else {
		var a = [];
		a[0] = "";
	}
	if($("#front_product_affiliate_select_"+a[0]).html()) {
		$("#front_product_affiliate_select_"+a[0]).show();
	} else {
		frontLoad("affiliate="+a[0]);
	}
}

function tabSelect(section,id) {
	var objChild = document.getElementById(section).childNodes;
	for (var i = 0; i < objChild.length; i++) {
		if(objChild[i].id) {
			$("#"+objChild[i].id).removeClass("selected");
		}
	}
	var objContChild = document.getElementById(section+"Cont").childNodes;
	for (var i = 0; i < objContChild.length; i++) {
		if(objContChild[i].id) {
			$("#"+objContChild[i].id).hide();
		}
	}

	$("#"+id+"Cont").show();
	$("#"+id).addClass("selected");
}

function sendForm(id,funct,upd,par) {
	if(checkForm(id) == true) {
		loadingShow();
		var str = "";
		$("#"+id+" input, #"+id+" select, #"+id+" textarea").each(function(n,element) {
			if($(element).attr("type") != "button") {
				if($(element).attr("type") == "checkbox" || $(element).attr("type") == "radio") {
					if($(element).is(":checked")) {
						str += $(element).attr('id')+"="+$(element).val()+"&";
					}
				} else {
					str += $(element).attr('id')+"="+encodeURIComponent($(element).val())+"&";
				}
			}
		})
		if(funct) {
			$.post("blocks/function/"+funct+".php",str+par,
				function result(data) {
					loadingHide();
					statusShow(data);
					var r = JSON.parse(data);
					if(r && r.result && r.result == 'error') {return;}
					windowClose();
					if(upd) {menu(upd,upd,str+par);}
				}
			);
		} else {
			if(upd) {
				menu(upd,upd,str+par);
				windowClose();
			}
		}
	}
}


function getForm(id) {
	if(checkForm(id) == true) {
		var str = "";
		$("#"+id+" input, #"+id+" select, #"+id+" textarea").each(function(n,element) {
			if($(element).attr("type") != "button") {
				if($(element).attr("type") == "checkbox" || $(element).attr("type") == "radio") {
					if($(element).is(":checked")) {
						str += $(element).attr('id')+"="+$(element).val()+"&";
					}
				} else {
					str += $(element).attr('id')+"="+encodeURIComponent($(element).val())+"&";
				}
			}
		})
		return str;
	}
}

function productImgCheck(id,par) {
	sendPar('catalog',par,function(data) {
		if(data) {
			var r = JSON.parse(data);
			if(r.url) {
				$("#product_img_"+id).html("<div class='product_img_mini' onclick=\"popup('product_img', 'product="+id+"');\"><img src='"+r.url+"' /></div>");
			} else {
				$("#product_img_"+id).html("<span onclick=\"popup('product_img', 'product="+id+"');\" class='btn grey plus'><span></span>Изображение</span>");
			}
		}
	});
}

function productImgDel(id,par) {
	sendPar('catalog',par,function(data) {
		var r = JSON.parse(data);
		if(r.result && r.result == 'success') {
			windowClose();
			productImgCheck(id,'product_img_check='+id);
		}
	});
}

function sendPar(funct,par,callback) {
	$.post("blocks/function/"+funct+".php",par,
		function result(data) {
			statusShow(data);
			if(callback) {
				callback(data);
			}
		}
	);
}

function checkForm(form) {
	var testcheck = 1;
	var testemail;
	var message = "";
	if($("#"+form+" #name")) {
		if(($("#"+form+" #name").val()=="")){testcheck += 1;}
	}
	if($("#"+form+" #price")) {
		if(($("#"+form+" #price").val()=="")){testcheck += 1;}
	}
	if($("#"+form+" #kol")) {
		if(($("#"+form+" #kol").val()=="")){testcheck += 1;}
	}
	if($("#"+form+" #phone")) {
		if(($("#"+form+" #phone").val()=="")){testcheck += 1;}
	}
	if($("#"+form+" #email")) {
		if(($("#"+form+" #email").val()=="")){testcheck += 1;}
	}
	if($("#"+form+" #password")) {
		if(($("#"+form+" #password").val()=="")){testcheck += 1;}
	}
	if(testcheck > 1) {
		message = "Вы заполнили не все обязательные поля.";
	}
	if(testemail == false) {
		message = message+" Введите корректный email.";
	}
	if(message != "") {
		statusType('error',message);
		return false;
	} else {
		return true;
	}
}

function popupShow(data) {
	$("#popup").html(data);
	$("#overlay").show();
}

function popupDelete(funct, name, filter) {
	var display = "\
	<h2 align='center'>Удаление</h2>\
	<p align='center'>"+name+"</p>\
	<p align='center' class='red'>Внимание, эту операцию нельзя отменить!</p>";
	display += "<p class='popup_buttons'><span onclick=\"sendForm('popup','"+funct+"','"+funct+"','"+filter+"');\" class='btn save'>Удалить</span><span onclick='windowClose();' class='btn grey'>Отмена</span></p>";
	popupShow(display);
}

function popup(o,f) {
	loadingShow();
	$.post("blocks/oper.php","oper="+o+"&"+f,
		function result(data) {
			popupShow(data);
			if(ca && o == "cashbox_oper") {$("#popup #print_cash_oper_block").html("<input id='print_cash_oper' type='checkbox' value='1' /> <label for='print_cash_oper'>Распечатать кассовый чек</label>"); $("#popup #print_cash_oper_button").html("<span onclick='ci();' class='btn save'>Сохранить</span><span onclick=\"windowClose();\" class='btn grey'>Отмена</span>");}
			if(ca && o == "cashbox_time") {$("#popup #print_cash_time_block").html("<input id='print_cash_time' type='checkbox' value='1' checked='checked' /> <label for='print_cash_time'>Закрыть смену на ФР и распечатать Z-отчет</label>"); $("#popup #print_cash_time_button").html("<span onclick='cz();' class='btn save'>Закрыть</span><span onclick=\"windowClose();\" class='btn grey'>Отмена</span>");}
			loadingHide();
		}
	);
}

function windowClose() {
	$("#popup").html("");
	$("#overlay").hide();
	$("#overlay_fr").hide();
}

function component_cat_select(id) {
	var category = document.getElementById('category');
	var childcategory = category.childNodes;
	for (var i = 0; i < childcategory.length; i++) {
		if(childcategory[i].id) {
			document.getElementById(childcategory[i].id).className='fr_cat';
		}
	}
}

function igo_Add(elem, vadd, id) {
	var curCh;
	for (var j=0; j < vadd.length; j++) {
		curCh = vadd.charAt(j);
		if((curCh == ",")||(curCh == ".")||(curCh == "0")||(curCh == "1")||(curCh == "2")||(curCh == "3")||(curCh == "4")||(curCh == "5")||(curCh == "6")||(curCh == "7")||(curCh == "8")||(curCh == "9")) {
			if (curCh == ",") {
				vadd = vadd.replace(/,/g, '.');
				document.getElementById(id).value = vadd;
			}
			continue;
		} else {
			document.getElementById(id).value = "";
			statusType('error','Можно вводить только числовые значения');
			return false;
		}
	}
	return true;
}



function checkNumber(el, v) {
	var c;
	for(var i=0; i<v.length; i++) {
		c = v.charAt(i);
		if((c == ",")||(c == ".")||(c == "0")||(c == "1")||(c == "2")||(c == "3")||(c == "4")||(c == "5")||(c == "6")||(c == "7")||(c == "8")||(c == "9")) {
			if(c == ",") {$(el).val(v.replace(/,/g, '.'));}
			continue;
		} else {
			$(el).val("");
			statusType('error','Можно вводить только числовые значения');
			return false;
		}
	}
	return true;
}

function roundNum(v, d) {
	v=Number(v);
	var b = 1;
	if(!d){d=2;}
	for(var i=1; i<=d; i++) {
		b += "0";
	}
	b = Number(b);
	b1 = b*10;
	v = Math.round(v*b1)/b1;
	v = Math.round(parseFloat(v)*b)/b;
	return v;
}

function dotReplace(e, v) {
	var curCh;
	for(var j=0; j < v.length; j++) {
		curCh = v.charAt(j);
		if(curCh == ",") {
			v = v.replace(/,/g, '.');
			$(e).val(v);
		}
		continue;
	}
	return true;
}

function category_add(name) {
	$("#fade").hide();
	$("#window").hide();
	$.ajax({
		url: "blocks/function/catalog.php",
		type: "POST",
		data: name = name,
		success: function (data) {
			if(date == '1') {status_g();}
			else {status_r();}
		}
	});
}

function generator(id,l) {
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    	result = "";
    for(var i=0, n=charset.length; i<l; ++i) {
    	result += charset.charAt(Math.floor(Math.random() * n));
    }
	 $("#"+id).val(result);
}

function secretChange() {
	$.ajax({
		url: "blocks/function/secret.php",
		cache: false,
		success: function (data) {
			document.getElementById('secret').value = data;
		},
	});
}

function certificateGen() {
	var type = $('#certificate_type option:selected').val();
	var cnt, mask = "";
	if(type == 2) {
		cnt = $('#certificate_cnt').val();
		mask = $('#certificate_mask').val();
		if(cnt < 1 || cnt > 50) {
			statusType('error', "Неверное количество сертификатов (допустимое значение от 1 до 50 знаков)");
			return;
		}
		if(mask.length > 0 && (mask.length < 4 || mask.length > 20)) {
			statusType('error', "Неверная длина маски (допустимое значение от 4 до 20 знаков)");
			return;
		}
		if(mask.length > 0 && (mask.split("X").length - 1 + mask.split("0").length - 1) < 4) {
			statusType('error', "Добавьте в маску не менее 4 символов X или 0 для генерирования букв и цифр");
			return;
		}
	}

	$.post("blocks/function/certificate.php","certificate_gen=&type="+type+"&cnt="+cnt+"&mask="+mask,
		function result(data) {
			$("#certificate_number").val(data);
		}
	);
}

function printType() {
	var list = document.getElementById("check");
	var value = list.options[list.selectedIndex].value;
	if (value == 1) {
		$("#checkTovarn").hide();
		$("#check80").show();
	} else {
		$("#checkTovarn").show();
		$("#check80").hide();
	}
}


function filterSelector(group,el) {
	var objChild = group.childNodes;
	for(var i=0; i<objChild.length; i++) {
		if(objChild[i]) {$(objChild[i]).removeClass("selected");}
	}
	$(el).addClass('selected');
}

function filterResult(group) {
	var filter = "";
	$("#"+group+" div").each(function(n,element) {
		if($(element).hasClass('selected')) {
			filter += $(element).attr('info')+"&";
		}
	});
	return filter;
}

function myFilter(id,loc,upd,param) {
	var str = "";
	$("#"+id+" input, #"+id+" select, #"+id+" textarea, #"+id+" radio").each(function(n,element) {
		if($(element).attr("type") != "button") {
			if($(element).attr("type") == "checkbox" || $(element).attr("type") == "radio") {
				if($(element).is(":checked")) {
					str += $(element).attr('id')+"="+$(element).val()+"&";
				}
			} else {
				str += $(element).attr('id')+"="+$(element).val()+"&";
			}
		}
	});
	if(param) {str += param;}
	menu(loc,upd,str);
}

function mySelect(el,upd,funct,par) {
	var str = el.options[el.selectedIndex].value;
	if(funct) {
			$.post("blocks/function/"+funct+".php",str+par,
				function result(data) {
					statusShow(data);
					if (upd != "") {
						menu(upd,upd,str+par);
					}
				}
			);
	} else {
		if (upd != "") {
			menu(upd,upd,str+par);
		}
	}
}


function myPrint() {
	text = document;
	print(text);
}

function certificatePrint(id) {
	if(id != "") {
		window.open("blocks/content/certificate_print.php?id="+id,"certificate","height=570,width=285,left=300,top=50");
	}
}

function reportSelect(id) {
	$("#reportSection input").each(function(n,element) {
		$(element).attr('checked', false);
	});
	$("#"+id+"2").attr('checked', true);
	var objChild = document.getElementById("reportSection").childNodes;
	for (var i = 0; i < objChild.length; i++) {
		if(objChild[i].id) {
			$("#"+objChild[i].id).removeClass("current");
		}
	}
	if(id == "report_sale" || id == "report_store" || id == "report_orders" || id == "report_waiter") {$("#giveIngredient").hide(); $("#report_period").show();} else {$("#giveIngredient").show(); $("#report_period").hide();}
	$("#"+id).addClass("current");
}


function catSelect(id,el) {
	$("#"+id+" div").each(function(n,element) {
		$(element).removeClass("selected");
	});
	$(el).addClass("selected");
	$(el).children().attr("checked","checked");
}

function selectAdd(id) {
	var value = $("#form_comp_select input:checked").attr("id");
	var name = $("#form_comp_select input:checked").val();
	if(!value) {
		$("#section_comp_select_cat div").each(function(n,element) {
			if($(element).attr("class") == "category selected" || $(element).attr("class") == "sub_category selected") {
				value = $(element).attr("id");
				name = $(element).attr("info");
			}
		});
	}
	if(value && name) {
		$("#"+id).val(value);
		$("#"+id+"_name").val(name);
		$("#"+id+"_name_show").html(name);
		sendForm('form_report','','reports','');
	} else {
		popupShow("<h2 align='center'>Ошибка</h2><br /><p align='center'>Не выбран товар или сырье</p><br /><p align='center'><span onclick='windowClose();' class='btn grey'>Закрыть</span></p>");
	}
}

function onCheck(funct,param,id,element) {
	if($(element).attr("checked") == true) {var str = param+"=&id="+id+"&checked=1";} else {var str = param+"=&id="+id;}
	$.post("blocks/function/"+funct+".php",str,
		function result(data) {
			statusShow(data);
		}
	);
}

function grafTooltip(id,i,w,h,d) {

	var x = Number($("#dot_"+id+i).attr('cx'));
	var y = Number($("#dot_"+id+i).attr('cy'));
	var width = d.length * 7 + 14;
	var height = 2 * 13;

	if(w - x < width + 10) {x = x - width - 1;} else {x = x + 1;}
	if(h - y < height + 50) {y = y - height - 10;} else {y = y + 10;}

	var plt = [];
	var prt = [];
	var prd = [];
	var pld = [];

	tx = x + (d.length * 7 + 14)/2;
	ty = y + (3 * 13)/2.33;

	var tooltip = document.getElementById("tooltip_b"+id);
	tooltip.setAttribute("visibility", "visible");
   tooltip.setAttribute("x", x);
	tooltip.setAttribute("y", y);
	tooltip.setAttribute("width", width);

	tooltip = document.getElementById("tooltip"+id);
	tooltip.setAttribute("visibility", "visible");
   tooltip.setAttribute("x", tx);
   tooltip.setAttribute("y", ty);
	tooltip.textContent = d;

	$("#dot_"+id+i).attr('r','4');
}

function grafTooltipHide(id,i) {
	$("#dot_"+id+i).attr('r','3');
	var tooltip = document.getElementById("tooltip"+id);
    tooltip.setAttribute("visibility", "hidden");
	tooltip = document.getElementById("tooltip_b"+id);
    tooltip.setAttribute("visibility", "hidden");
}

function plantCalculate(par) {
	var str = "sel_plant="+$("#plantSelForm #plant option:selected").val();
		str += "&sel_orders="+$("#plantSelForm #orders option:selected").val();
		str += "&sel_affiliate="+$("#plantSelForm #affiliate option:selected").val();
		str += "&sel_api="+$("#plantSelForm #api option:selected").val();
		str += "&sel_integr="+$("#plantSelForm #integr option:selected").val();
		str += "&sel_users="+$("#plantSelForm #dop_users option:selected").val();
		str += "&sel_couriers="+$("#plantSelForm #dop_couriers option:selected").val();
		str += "&oper=plant_select";

	if(par == 'change') {
		str += "&cost_to_pay="+$("#plantSelForm #cost_to_pay").val();
	}
	loadingShow();
	$.post("blocks/oper.php",str,
	function result(data) {
		loadingHide();
		if(par == 'change') {
			windowClose();
			menu('payment','payment');
			statusShow(data);
		} else {
			$("#plant_select").html(data);
		}
	});
}

function setDot(str) {
	var curCh;
	for(var j=0; j<str.length; j++) {
		curCh = str.charAt(j);
		if (curCh == ",") {str = str.replace(/,/g, '.');}
		continue;
	}
	return Number(str);
}

function datetimeValidator(date, time) {
	var date = date.split(".");
	var time = time.split(":");
	var d = date[0];
	var m = date[1];
	var y = date[2];
	var h = time[0];
	var i = time[1];
	var s = time[2];
	var dt = new Date(y, m-1, d, h, i, s);
	return ((y == dt.getFullYear()) && ((m-1) == dt.getMonth()) && (d == dt.getDate()) && (h == dt.getHours()) && (i == dt.getMinutes()) && (s == dt.getSeconds()));
}

function checkRevizDT(datetime) {
	var dt = new Date();
	var m = (dt.getMonth()+1); if(m < 10) {m = "0"+m;}
	var current_datetime = dt.getDate()+"."+m+"."+dt.getFullYear()+" "+dt.getHours()+":"+dt.getMinutes()+":00";
	var dt = datetime.split(" ");
	if(dt[0] && dt[1]) {
		if(datetimeValidator(dt[0],dt[1]) == false) {
			popupShow("<h2 align='center'>Ошибка</h2><br /><p align='center'>Неверно указана дата или время</p><br /><p align='center'><span onclick='windowClose();' class='btn grey'>Закрыть</span></p>");
			$("#revis_datetime").val(current_datetime);
		}
	} else {
		popupShow("<h2 align='center'>Ошибка</h2><br /><p align='center'>Неверно указана дата или время</p><br /><p align='center'><span onclick='windowClose();' class='btn grey'>Закрыть</span></p>");
		$("#revis_datetime").val(current_datetime);
	}
}

function colorSelect(el,gr,id,color,id2,color2) {
	$("#"+gr+" div").each(function(n,e){$(e).removeClass('active');});
	$(el).addClass('active');
	$('#'+id).val(color);
	if(id2) {$('#'+id2).val(color2);}
}

function addDopAddress() {
	var cnt = 1;
	$("#add_dop_address tr").each(function(n,element) {
		cnt ++;
	})
	if(cnt < 6) {
		var display = "<tr>\
		<td align='right'><input id='street"+cnt+"' maxlength='100' class='input' autocomplete='off' style='width:190px;'></td>\
		<td align='left'><input id='home"+cnt+"' maxlength='50' class='input' autocomplete='off' style='width:30px;'></td>\
		<td align='left'><input id='pod"+cnt+"' maxlength='2' class='input' autocomplete='off' style='width:30px;'></td>\
		<td align='left'><input id='et"+cnt+"' maxlength='2' class='input' autocomplete='off' style='width:30px;'></td>\
		<td align='left'><input id='kvart"+cnt+"' maxlength='50' class='input' autocomplete='off' style='width:60px;'></td>\
		</tr>";
		$('#add_dop_address').append(display);
	} else {
		statusType('error','Максимум 5 дополнительных адресов');
	}
}

function tooltip(id,el) {
	if($("#"+id).is(":hidden"))  {
		var x = 0, y = 0;
		if(mobile_basket) {var cor = 0;} else {var cor = $('.section:visible').get(0).scrollTop;}
		var el_x = $(el).offset().left, el_y = $(el).offset().top+cor;
		var el_w = $(el).width(), el_h = $(el).height();
		var t_w = $("#"+id).width(), t_h = $("#"+id).height();
		if(el_y > t_h + 50) {
			$("#"+id+" .tooltip_arrow").removeClass('top').addClass('bottom');
			if(mobile_basket) {y = el_y - t_h - 20;} else {y = el_y - t_h - 70;}
		} else {
			$("#"+id+" .tooltip_arrow").removeClass('bottom').addClass('top');
			if(mobile_basket) {y = el_y + el_h + 30;} else {y = el_y + el_h - 25;}
		}
		if(el_x > t_w) {
			var a = t_w - el_w/2 - 10;
			if(t_w - a < 30) {a = t_w - 30;}
			$("#"+id+" .tooltip_arrow").css('left', a);
			x = el_x - t_w + el_w;
		} else {
			var a = el_w/2 - 10;
			if(a < 10) {a = 10;}
			$("#"+id+" .tooltip_arrow").css('left', a);
			x = el_x;
		}

		$("#"+id).css('left', x).css('top', y).show();
		$("#"+id+" .tooltip_content").css('width', $("#"+id).width()).css('height', $("#"+id).height());
	} else {
		$("#"+id).hide();
	}
}

function setSelectSelected(id, v) {
	if(v) {$("#"+id+" option:selected").each(function(){this.selected=false;}); $("#"+id+" [value='"+v+"']").attr("selected", "selected");} else {$("#"+id+" option:selected").each(function(){this.selected=false;});}
}

function setButtonSelected(s, v) {
	if(document.getElementById(s)) {
		var e = document.getElementById(s).childNodes;
		for (var i = 0; i < e.length; i++) {
			if(e[i]) {
				$(e[i]).removeClass("selected");
				if(v && $(e[i]).html() == v) {
					$(e[i]).addClass("selected");
				}
			}
		}
	}
}

function btnSelect(e) {
	if($(e).hasClass('selected')) {
		$(e).removeClass('selected');
	} else {
		$(e).addClass('selected');
	}
}

function importCheck(id,f) {
	var data = JSON.stringify(table[id].getData());
	popup(id,"&data="+data+f);
}

function importSend(id,l,f) {
	var data = JSON.stringify(table[id].getData());
	sendForm(id,l,l,id+'='+data+f);
}

function arrayFlip(a) {
	var tmp = {};
	if(a) {
		for(k in a) {
			tmp[a[k]] = 1;
		}
	}
	return tmp;
}

var kk="refresh|select|x|z|cashin|cashout|print|break|setspeed|kkm_speed|kkm_param|paidSum|noCashSum|type|positions|name|price|quantity|discount|paytype|check|return|init|findlog|complete|error|relog|version|shtrikh54fz|atol54fz|kkm_type|pirit54fz";
var kk_ru="Не подключено|Подключить|Подключено|Отключить|Найдено устройство|Наценка|Ошибка соединения";

function pzConnect() {
		if(gl_pz_server && gl_pz_pwd) {
        if($("#pz_connect div").attr('class') == 'im m_tel_dis') {
           var st = pz.connect({
             	user_phone: gl_pz_user,
               host: gl_pz_server,
               client_id: gl_pz_pwd,
               client_type: 'frontpad'
           });

			  if(st.result == "ok") {connectIndicator("c");}
        } else {
            pz.disconnect();
        }
		}
}

window.setInterval(function() {
      if(pz.isConnected()) {
         connectIndicator("c");
      } else {
			connectIndicator("");
		}
}, 1000);

function connectIndicator(status) {
	if(status == "c") {
		$('#pz_connect div').removeClass('m_tel_dis').addClass('m_tel_en');
	} else {
		$('#pz_connect div').removeClass('m_tel_en').addClass('m_tel_dis');
	}
}

$(window).focus(function (e) {
	if(!pz.isConnected()) {
		pzConnect();
	}
});

function sanitizePhone(phone) {
	phone = phone.replace(/\D/g, '');
	return phone;
}

function makeCall(phone) {
	pz.call(sanitizePhone(phone));
}

function showCard(phone) {
	var display = "<h2 align='center'>Входящий звонок</h2>"+
		"<p align='center' id='call_name'>Определяется...</p>"+
		"<p align='center'>"+phone+"</p>"+
		"<p align='center' style='margin-top:20px;' id='call_button'></p></div>";
	$('#popup_tel').html(display).show();
	$.post("blocks/function/client.php","search_tel="+encodeURIComponent(phone),
		function result(data) {
			var contact = eval("("+data+")");
			if(contact.name) {var name = contact.name;} else {var name = "Клиент не определен";}
			var button = "<span class='btn save' onclick=\"pasteClient(this);$('#popup_tel').hide();\" info='"+data+"'>Новый заказ</span> <span class='btn grey' onclick=\"$('#popup_tel').hide();\">Закрыть</span>";
			$("#popup_tel #call_name").html(name);
			$("#popup_tel #call_button").html(button);
		}
	);
}

function pasteClient(el) {
	menu('front','');
	tabSelect('front_tabs','tab_details');
	billLoadClient($(el).attr('info'));
 }
