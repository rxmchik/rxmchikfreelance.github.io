var orderCounter = 20;
var last_order = 0;
var beep = 0;
var filter1 = "";
var filter2 = "";
var filter3 = "";
var filter4 = "";
var filter5 = "";
var filter_all = "";
var limit = 20;
var api_check;
var api_checker_id;
var api_interval;
var api_interval_id;

function ordersListMore() {
	ordersListShow(orderCounter);
	orderCounter = orderCounter + limit;
}

function orderFilter() {
	filter1 = $("#filter_order_date option:selected").val();
	filter2 = $("#filter_order_waiter option:selected").val();
	filter3 = $("#filter_order_status option:selected").val();
	filter4 = $("#filter_order_pay option:selected").val();
	if($("#filter_order_point option:selected")) {filter5 = $("#filter_order_point option:selected").val();}

	filter_all = filter1+"&"+filter2+"&"+filter3+"&"+filter4+"&"+filter5;
}

function ordersList(s,par) {
	orderFilter();
	if(par == 'period') {filter1 = "";}
	if(filter1 == 'period') {
		tooltip('filter_orders',$('#filter_order_date'));
	} else {
		orderCounter = 20;
		loadingShow();
		if(par == 'period') {
			$("#newPeriod").remove();
			var tdate1 = $("#periodDate1").val();
			var tdate2 = $("#periodDate2").val();
			$("#filter_order_date").append($("<option id='newPeriod' value='+datetime1="+tdate1+"&datetime2="+tdate2+"'>"+tdate1+" - "+tdate2+"</option>"));
			$("#filter_order_date option:last").attr("selected", "selected");
			$("#filter_orders").hide();
		}
		ordersListShow(0);
		$("#map_button").attr("onclick","menu('map','map','"+filter_all+"');");
	}
}

function ordersListShow(s) {
	var last_order_tmp = last_order;
	orderFilter();
	loadingShow();
	$.post("blocks/content/orders_list.php",filter_all+"&start="+s,
		function result(data) {
			loadingHide();
			if(s == 0) {$("#orders_content").html("");}
			if(data) {
				var r = JSON.parse(data);
				if(r) {
					if(r.exit) {exit();}
					if(r.order) {
						orderShowStat(data);
						$("#orders_content").append(orderShow(data));
						if(r.stat.last_order) {last_order = r.stat.last_order;}
						if(r.stat.more) {$("#order_more").show();} else {$("#order_more").hide();}
						s = s + limit;
						if(last_order > last_order_tmp && beep == 1) {$('#sound')[0].play();}
						beep = 0;
					} else {
						statusShow(data);
						orderShowStat();
					}
				}
			} else {
				loadingHide();
				$("#order_more").hide();
				orderShowStat();
			}
			checkApi();
		}
	);
}

function orderDel(id) {
	ordersList();
}

function orderContent(id) {
	$("#orderContent"+id).html("Загрузка...");
	$.post("blocks/function/orders.php","order_content="+id,
		function result(data) {
			$("#orderContent"+id).html(data);
		}
	);
}

function orderShowStat(r) {
	var d = eval("("+r+")");
	if(d && d.stat.count) {$("#orders_data_count").html(d.stat.count);} else {$("#orders_data_count").html("0");}
	if(d && d.stat.average) {$("#orders_data_sred").html(d.stat.average);} else {$("#orders_data_sred").html("0");}
	if(d && d.stat.total) {$("#orders_data_total").html(d.stat.total);} else {$("#orders_data_total").html("0");}
}

function orderShow(r) {
	var d = eval("("+r+")");
	if(d && d.id) {
		var display = "";
		for(o in d.id) {
			var id = d.id[o];
			display += "<tr id='order_space"+id+"' height='10'><td colspan='9'></td></tr>";
			display += "<tr class='tr_order_head' id='order_head_"+id+"' style='background:"+gs_status_color2[d.order[id].status]+";'>";
			display += "<td colspan='6'>";
			display += "<table border='0' cellpadding='0' cellspacing='0' style='border:none;'>";
			display += "<tr>";
			display += "<td><span class='order_datetime' id='order_datetime_"+id+"' onclick=\"orderStatusTime('"+id+"');\"><span class='order_time'>"+d.order[id].time+"</span> "+d.order[id].date+" (№ "+d.order[id].orderN+")</span></td>";
			display += "<td>";
			if(d.order[id].type == 5) {
				display += "<span onclick=\"orderLoad('"+id+"','2');\" class='btn grey order'>Возврат</span>";
			} else {
				display += "<span onclick=\"orderLoad('"+id+"');\" class='btn grey order'>Изменить</span>";
			}
			display += "</td><td id='order_print_"+id+"'>";
			if(gs_print_type.length > 1) {
				display += "<span onclick=\"orderPrintSelect('"+id+"');\" class='btn grey order'>Печать</span>";
			} else if(gs_print_type[0]) {
				display += "<span onclick=\"orderPrint('"+id+"','"+gs_print_type[0]+"');\" class='btn grey order'>Печать</span>";
			}
			display += "</td><td>";
			if(d.order[id].type == 5) {display += " <span class='order_api'>фискальный</span>";}
			if(d.order[id].type == 6) {display += " <span class='order_api'>возврат</span>";}
			if(d.order[id].online == 1) {display += " <span class='order_api'>online</span>";}
			if(d.order[id].online == 2) {display += " <span class='order_api'>app</span>";}
			if(d.order[id].online == 3) {display += " <span class='order_api'>delivery club</span>";}
			if(d.order[id].online == 4) {display += " <span class='order_api'>яндекс еда</span>";}
			if(d.order[id].overdue) {display += " <span class='order_overdue'>просрочен</span>";}
			display += "</td></tr></table>";
			display += "</td>";
			display += "<td align='right' id='waiterBlock"+id+"'><select id='select_waiter"+id+"' style='max-width:130px;' onchange=\"selectWaiter('"+id+"','"+gs_waiter_multi+"');\" "; if(gs_waiter_multi) {display += "multiple='multiple' style='max-width:200px; height:60px;'";} display += "><option value=''>Сотрудник</option>";
			if(gs_waiter_name && gs_waiter_name.length > 0) {
				var tmp = arrayFlip(d.order[id].waiter.split(","));
				for(w in gs_waiter_name) {
					if(gs_waiter_fired[w] != '1' && (gs_waiter_affiliate[w] == d.order[id].affiliateID || gs_waiter_affiliate[w] == '0')) {
						if(tmp[w]) {
							display += "<option value='"+w+"' selected='selected'>"+gs_waiter_name[w]+"</option>";
						} else {
							display += "<option value='"+w+"' >"+gs_waiter_name[w]+"</option>";
						}
					}
					if(gs_waiter_fired[w] && tmp[w]) {
						display += "<option value='"+w+"' selected='selected'>"+gs_waiter_name[w]+"</option>";
					}
				}
			}
			display += "</td>";
			display += "<td align='left'><select id='select_status"+id+"' onchange=\"selectStatus('"+id+"');\" style='max-width:130px;'>";
			if(gs_status_id && gs_status_id.length > 0) {
				for(s in gs_status_id) {
					if(gs_status_id[s] == d.order[id].status) {
						display += "<option value='"+gs_status_id[s]+"' selected='selected'>"+gs_status_name[gs_status_id[s]]+"</option>";
					} else {
						display += "<option value='"+gs_status_id[s]+"' >"+gs_status_name[gs_status_id[s]]+"</option>";
					}
				}
			}
			display += "</select></td><td></td></tr>";
			display += "<tr class='tr_order_body' id='order_body_"+id+"' align='center' style='background:"+gs_status_color[d.order[id].status]+";'>";
			display += "<td width='300' align='left'><span id='orderContent"+id+"'>";
			if(d.order[id].positions && d.order[id].positions.productID.length > 0) {
				display += "<table width='100%' border='0' cellpadding='0' cellspacing='0'>";
				for(i in d.order[id].positions.productID) {
					if(d.order[id].positions.parent[i] == "") {
						display += "<tr><td>"+d.order[id].positions.name[i];
						if(d.order[id].positions.auto[i] == 1) {display += " <span class='grey'>[авто]</span>";}
						if(d.order[id].positions.auto[i] == 2) {display += " <span class='grey'>[сертификат]</span>";}
						display += "</td><td width='30'>"+d.order[id].positions.kol[i]+"</td><td align='right'>"+d.order[id].positions.price[i]+"</td></tr>";
						for(m in d.order[id].positions.productID) {
							if(d.order[id].positions.parent[m] != "" && d.order[id].positions.parent[m] == d.order[id].positions.parID[i]) {
								display += "<tr><td> + "+d.order[id].positions.name[m]+"</td><td width='30'>"+d.order[id].positions.kol[m]+"</td><td align='right'>"+d.order[id].positions.price[m]+"</td></tr>";
							}
						}
					}
				}
				display += "</table>";
			} else {
				display += "<span onclick=\"orderContent('"+id+"');\" class='href'>показать заказ</span>";
			}
			display += "</span></td>";
			display += "<td align='center'>"+d.order[id].total+"</td>";
			display += "<td>";
			if(d.order[id].sale) {display += d.order[id].sale+"%<br />";}
			if(d.order[id].u_sale) {display += d.order[id].u_sale+" "+currency+"<br />";}
			if(d.order[id].client_sale) {display += d.order[id].client_sale+"%<br />";}
			if(d.order[id].cert_sale) {display += d.order[id].cert_sale+"%<br />";}
			if(d.order[id].cert_amount) {display += d.order[id].cert_amount+" "+currency+"<br />";}
			display += "</td>";
			display += "<td>";
			if(gs_pay_type == 2) {
				display += "<select style='width:70px;' onchange=\"orderPay(this,'"+id+"')\" "; if(d.order[id].type == 5) {display += "disabled='disabled'";} display += " >";
				display += "<option value=''></option>";
				if(gs_pay_types && gs_pay_types.length > 0) {
					for(p in gs_pay_types) {
						if(p == d.order[id].pay) {
							display += "<option value='"+p+"' selected='selected'>"+gs_pay_types[p]+"</option>";
						} else {
							display += "<option value='"+p+"' >"+gs_pay_types[p]+"</option>";
						}
					}
				}
				display += "</select>";
			} else {
				display += "<input type='checkbox' value='1' "; if(d.order[id].pay == 1) {display += " checked='checked' ";} display += "onclick=\"orderPay(this,'"+id+"')\" "; if(d.order[id].type == 5 || d.order[id].type == 6) {display += "disabled='disabled'";} display += " />";
			}
			display += "</td>";
			display += "<td align='center'>";
			if(d.order[id].card) {display += d.order[id].card+"<br />";}
			if(d.order[id].clientID) {display += "<span class='icon stat' onclick=\"popup('client_stat','client_stat="+d.order[id].clientID+"')\"></span>";}
			display += "</td>";
			display += "<td align='center'>";
			if(gs_point[d.order[id].point]) {display += gs_point[d.order[id].point];}
			display += "</td>";
			display += "<td align='left'>";
			if(d.order[id].street || d.order[id].home || d.order[id].kvart || d.order[id].descr || d.order[id].table) {
				display += "<div class='address'>";
				display += d.order[id].street;
				if(d.order[id].street && d.order[id].home) {display += ", ";}
				display += d.order[id].home;
				if((d.order[id].street || d.order[id].home) && d.order[id].kvart) {display += ", ";}
				display += d.order[id].kvart+" ";
				if(d.order[id].descr) {display += "("+d.order[id].descr+") ";}
				if(d.order[id].table) {display += "Стол "+d.order[id].table;}
				display += "</div>";
			}
			if(d.order[id].tags) {
				var tmp = d.order[id].tags.split(',');
				display += "<div class='tags'>";
				for(t in tmp) {
					if(gs_tag_name[tmp[t]]) {
						display += "<span>"+gs_tag_name[tmp[t]]+"</span>";
					}
				}
				display += "</div>";
			}
			display += "</td>";
			display += "<td>"+d.order[id].phone+"</td>";
			display += "<td align='center'>";
			display += "<span onclick=\"popupDelete('orders','Заказ № "+d.order[id].orderN+"','order_del="+id+"');\" class='icon delete'></span>";
			display += "</td>";
			display += "</tr>";

		}
		return display;
	}
}

function orderPay(el,id) {
	var tmp = "";
	if($(el).attr("type") == "checkbox") {
		if($(el).attr("checked") == true) {tmp = 1;}
	} else {
		tmp = el.options[el.selectedIndex].value;
	}
	$.post("blocks/function/order_pay.php","pay_type="+tmp+"&orderID="+id, function result(data) {});
}

function selectStatus(id) {
	var tmp = $("#select_status"+id+" option:selected").val();
	$("#order_head_"+id).css("background",gs_status_color2[tmp]);
	$("#order_body_"+id).css("background",gs_status_color[tmp]);
	$.post("blocks/function/status.php","status="+tmp+"&orderID="+id,	function result(data) {});
}

function selectWaiter(id,multi) {
	var tmp = "";
	if(multi) {
		tmp = encodeURIComponent($("#select_waiter"+id).val());
	} else {
		tmp = $("#select_waiter"+id+" option:selected").val();
	}
	$.post("blocks/function/employee.php","waiter="+tmp+"&orderID="+id, function result(data) {});
}

function orderSearchWindow() {
	var period_list = $("#serach_period_list").html();
	popupShow("<table border='0' cellpadding='0' cellspacing='3' width='380' id='form_order_search'>\
		<tr><td colspan='2'><h2 align='center'>Поиск заказа</h2></td></tr>\
		<tr height='30'><td width='30%' align='right'>Период</td><td><select id='period_list'>"+period_list+"</select></td></tr>\
		<tr height='30'><td width='30%' align='right'>№ заказа</td><td><input id='order_number' class='input' style='width:200px;' onkeydown=\"if(event.keyCode==13){orderSearch();}\" /></td></tr>\
		<tr height='30' valign='top' align='center'><td colspan='2'><span class='grey'>(будут показаны последние 10 заказов с таким номером)</span></td></tr>\
		<tr height='20' align='center'><td colspan='2'><span onclick='orderSearch();' class='btn save'>Найти</span><span onclick='windowClose();' class='btn grey'>Закрыть</span></td></tr>\
	</table>");
	$("#form_order_search #order_number").focus();
}

function orderSearch() {
	var n = $("#form_order_search #order_number").val()
	var period_list = $("#period_list option:selected").val()
	if(n) {
		loadingShow();
		if($("#filter_order_point option:selected").val()) {tmp = "&"+$("#filter_order_point option:selected").val();} else {tmp = "";}
		post("blocks/content/orders_list.php", "number="+n+"&"+period_list+tmp, function(data) {
			if(data) {
				loadingHide();
				orderShowStat();
				$("#orders_content").html(orderShow(data));
				$("#order_more").hide();
				windowClose();
			} else {
				loadingHide();
				statusType('error','Заказ не найден');
			}
		})
	} else {
		statusType('error','Укажите номер заказа');
	}
}

function orderPrint(id,param) {
	tooltip("order_print_baloon_"+id);
	if(gs_print_frame) {
		$("#print_frame").attr("src","blocks/content/"+param+"&orderID="+id+"&noprint");
		$("#print_frame").load(function(){
			window.frames["print_frame"].focus();
			window.frames["print_frame"].print();
		});
	} else {
		window.open("blocks/content/"+param+"&orderID="+id,"mywin","width=570,height=570,left=250,top=50");
	}
}

function orderPrintSelect(id) {
	var baloon = $("#order_print_baloon_"+id);
	if($(baloon).is(":visible") == true) {
		$(baloon).remove();
	} else {
		var display = "";
		for(i in gs_print_type) {
			display += "<span class='btn grey order print' onclick=\"orderPrint('"+id+"','"+gs_print_type[i]+"');\">"+gs_print_name[i]+"</span>";
		}
		var el = $("<div id='order_print_baloon_"+id+"' class='tooltip'></div>");
		$(el).html(""+display+"<div class='tooltip_arrow'></div>");
		$("#order_print_"+id).append(el);
		tooltip("order_print_baloon_"+id,$("#order_print_"+id));
	}
}

function orderStatusTime(id) {
	var baloon = $("#order_datetime_baloon_"+id);
	if($(baloon).is(":visible") == true) {
		$(baloon).remove();
	} else {
		loadingShow();
		$.post("blocks/function/status.php","status_time="+id,
			function result(data) {
				loadingHide();
				var el = $("<div id='order_datetime_baloon_"+id+"' class='tooltip'></div>");
				$(el).html("<div class='tooltip_content'>"+data+"</div><div class='tooltip_arrow'></div>");
				$("#order_datetime_"+id).append(el);
				tooltip("order_datetime_baloon_"+id,$("#order_datetime_"+id));
		});
	}
}

function smsDistrib(id) {
	var baloon = $("#order_phone_baloon_"+id);
	if($(baloon).is(":visible") == true) {
		if($("#order_phone"+id).attr("info") != "active") {
			$(baloon).remove();
		}
	} else {
		loadingShow();
		$.post("blocks/function/status.php","distrib_show="+id,
		function result(data) {
			loadingHide();
			var el = $("<div id='order_phone_baloon_"+id+"' class='tooltip'></div>");
			$(el).html("<div class='tooltip_content'>"+data+"</div><div class='tooltip_arrow'></div>");
			$("#order_phone_"+id).append(el);
			tooltip("order_phone_baloon_"+id,$("#order_phone_"+id));
		});
	}
}

function smsDistribSend(elem, id, status) {
	$("#order_phone"+id).attr("info","active");
	$(elem).html("Отправка").removeClass("error").addClass("process").attr("onclick","");
	$.post("blocks/function/status.php","distrib_send="+id+"&status="+status,
	function result(data) {
		var response = eval("("+data+")");
		if(response.sms && response.sms == "1") {
			$(elem).html("Отправлено").addClass("ok");
		} else {
			$(elem).html("Ошибка").removeClass("process").addClass("error").attr("onclick","smsDistribSend(this, '"+id+"','"+status+"');");
		}
		$("#order_phone"+id).attr("info","");
	});
}

function genApiCheckerId() {
	var nId = '', allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (var i = 0; i < 8; ++i) {
		nId += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
	}
	return nId;
};

function checkLocalStorage() {
	return typeof window.localStorage != 'undefined' && window.localStorage;
}

function checkApiId(int) {
	if(localStorage['api_checker_id']) {
		if(api_checker_id == localStorage['api_checker_id']) {
			checkOrder(int);
		}
	} else {
		setApiId();
	}
}

function checkApi() {
	clearInterval(api_interval_id);
	if(api_check == 1 && api_interval) {
		if(checkLocalStorage()) {
			setApiId();
			api_interval_id = window.setInterval("checkApiId("+api_interval+")", api_interval);
		} else {
			api_interval_id = window.setInterval("checkOrder()", api_interval);
		}
	}
}

window.onbeforeunload = function() {
	window.localStorage.setItem("api_checker_id", "");
};

function setApiId() {
	api_checker_id = genApiCheckerId();
	window.localStorage.setItem("api_checker_id", api_checker_id);
}

function checkOrder() {
	$.post("../blocks/function/orders_check.php",orderFilter()+"&orders_check=&last_order="+last_order,
		function result(data) {
			if(data) {
				var response = eval("("+data+")");
				if(response && response.new_orders) {
					setTimeout(function(){
						beep = 1;
						ordersList(0);
					}, 1000);
				}
			}
		}
	);
}
