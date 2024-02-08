var mobile_basket;

var bill = {};
bill['positions'] = {};
bill['positions']['productID'] = [];
bill['positions']['name'] = [];
bill['positions']['kol'] = [];
bill['positions']['kol_val'] = [];
bill['positions']['kol_el'] = {};
bill['positions']['price'] = [];
bill['positions']['price_'] = [];
bill['positions']['total'] = [];
bill['positions']['total0'] = [];
bill['positions']['sale'] = [];
bill['positions']['disc'] = [];
bill['positions']['score'] = [];
bill['positions']['mod'] = [];
bill['positions']['parID'] = [];
bill['positions']['parent'] = [];
bill['positions']['dp'] = [];
bill['positions']['auto'] = [];
bill['positions']['vat'] = [];
bill['positions']['hash'] = [];
bill['positions']['excise'] = [];

bill['order_edit'] = "";
bill['sale'] = 0;
bill['u_sale'] = 0;
bill['client_sale'] = 0;
bill['clientID'] = "";
bill['cert_sale'] = 0;
bill['cert_amount'] = 0;
bill['margin'] = 0;
bill['margin_total'] = 0;

bill['certificate'] = "";
bill['person'] = "";
bill['table'] = "";

bill['phone_old']  = "";

bill['client_score'] = 0;

bill['total'] = 0;
bill['total0'] = 0;
bill['totalS'] = 0;
bill['totalS_old'] = 0;
bill['score'] = 0;
bill['score_old'] = 0;

bill['pay'] = "";
bill['point'] = "";
bill['channel'] = "";
bill['datetime'] = "";
bill['card'] = "";
bill['phone'] = "";
bill['name'] = "";
bill['street'] = "";
bill['home'] = "";
bill['pod'] = "";
bill['et'] = "";
bill['kvart'] = "";
bill['descr'] = "";
bill['email'] = "";
bill['tags'] = "";
bill['new_address'] = "";
bill['fr'] = "";

var parent = "";

var auto_select = [];
var auto_select_name = [];
var auto_select_kol = [];
var auto_select_price = [];
var auto_select_vat = [];
var auto_select_excise = [];
var auto_select_start = [];
var auto_select_stop = [];
var auto_select_pers = [];
var auto_select_ignore_sale = [];

var auto = {};
auto['productID'] = [];
auto['name'] = [];
auto['kol'] = [];
auto['price'] = [];
auto['price_'] = [];
auto['vat'] = [];
auto['excise'] = [];
auto['auto'] = [];

var cert = {};
cert['productID'] = [];
cert['name'] = [];
cert['kol'] = [];
cert['price'] = [];
cert['price_'] = [];
cert['vat'] = [];
cert['excise'] = [];
cert['auto'] = [];

var gl_score;
var gl_score_amount;
var gl_score_clients;
var gl_score_sale_block;
var gl_score_add_block;
var gl_score_limit = 100;
var gl_bill_reduction;
var gs_bill_round;
var gs_oper_name, gs_oper_vatin;
var ca,ce;
var dts;
var dts_settings = {};
var dts_dis = 0;

function billBuy(id,i,kol,name,price,sale,score,mod,dp,h,vat,excise) {
	if(!kol) {kol = 1;}
	kol = Number(kol);
	if(!i || i=='') {
		var i = 0;
		while(i < bill['positions']['productID'].length && (bill['positions']['productID'][i] != id || mod == 1 || bill['positions']['parent'][i] != parent)) i++;
	}
	if(i < bill['positions']['productID'].length) {
		bill['positions']['kol'][i] = Math.round((Number(bill['positions']['kol'][i]) + kol)*1000)/1000;
		/*m*/bill['positions']['kol_el'][bill['positions']['productID'][i]] = Math.round((bill['positions']['kol_el'][bill['positions']['productID'][i]] + kol)*1000)/1000;
	} else {
		bill['positions']['productID'][i]=id;
		bill['positions']['kol'][i]=Number(kol);
		bill['positions']['kol_val'][i]=kol;
		bill['positions']['name'][i]=name;
		bill['positions']['price'][i]=price;
		bill['positions']['sale'][i]=sale;
		bill['positions']['score'][i]=score;
		bill['positions']['mod'][i] = mod;
		bill['positions']['dp'][i]=dp;
		bill['positions']['auto'][i]="";
		bill['positions']['parent'][i] = parent;
		bill['positions']['vat'][i]=vat;
		bill['positions']['hash'][i]=h;
		bill['positions']['excise'][i]=excise;
		/*m*/
		if(!bill['positions']['kol_el'][bill['positions']['productID'][i]]) {
			bill['positions']['kol_el'][bill['positions']['productID'][i]]=kol;
		} else {
			bill['positions']['kol_el'][bill['positions']['productID'][i]]+=kol;
		}
		/*m*/
	}
	billBasketShow('basket');
}

function billAddChild(id) {
	if(id != parent) {
		$("#ingred"+parent).removeClass("down");
		$("#ingred"+parent).addClass("plus");
		$("#ingred"+id).addClass("down");
		parent = id;
	} else {
		$("#ingred"+parent).removeClass("down");
		$("#ingred"+id).addClass("plus");
		parent = '';
	}
}

function billUnBuy(i,kol) {
	bill['positions']['kol'][i] = Math.round((bill['positions']['kol'][i] - kol)*1000)/1000;
	/*m*/
	bill['positions']['kol_el'][bill['positions']['productID'][i]] = Math.round((bill['positions']['kol_el'][bill['positions']['productID'][i]] - kol)*1000)/1000;;
	if(mobile_basket) {
		if(bill['positions']['kol_el'][bill['positions']['productID'][i]] == 0) {
			bill['positions']['kol_el'][bill['positions']['productID'][i]] == "";
			$("#bill_kol_"+bill['positions']['productID'][i]).html("");
		} else {
			$("#bill_kol_"+bill['positions']['productID'][i]).html(" x"+bill['positions']['kol_el'][bill['positions']['productID'][i]]);
		}
	}
	/*m*/
	if(bill['positions']['kol'][i] == 0) {
		billDelComp(i);
		for(var key in bill['positions']['parent']){
			if((bill['positions']['parent'][key] === i) || (bill['positions']['parent'][key] == i)) {
				billDelComp(key);
			}
		}
	}
	billBasketShow();
}

function billDelComp(i) {
	if(parent == i) {parent = "";}
	/*m*/if(mobile_basket) {$("#bill_kol_"+bill['positions']['productID'][i]).html("");}
	delete(bill['positions']['productID'][i]);
	delete(bill['positions']['name'][i]);
	delete(bill['positions']['kol'][i]);
	delete(bill['positions']['price'][i]);
	delete(bill['positions']['total'][i]);
	delete(bill['positions']['sale'][i]);
	delete(bill['positions']['disc'][i]);
	delete(bill['positions']['score'][i]);
	delete(bill['positions']['mod'][i]);
	delete(bill['positions']['parID'][i]);
	delete(bill['positions']['parent'][i]);
	delete(bill['positions']['dp'][i]);
	delete(bill['positions']['auto'][i]);
	delete(bill['positions']['vat'][i]);
	delete(bill['positions']['hash'][i]);
	delete(bill['positions']['excise'][i]);
	delete(bill['positions']['kol_el'][bill['positions']['productID'][i]]);
}

function billCalcTotal(i) {
	bill['positions']['price'][i] = Math.round(bill['positions']['price'][i]*100)/100;
	bill['positions']['total0'][i] = bill['positions']['total'][i] = bill['positions']['kol'][i]*bill['positions']['price'][i];
	if(bill['positions']['sale'][i] == 1) {
		if(gl_score != 2 && !gl_score_sale_block) {var client_sale_tmp = bill['client_sale'];} else {var client_sale_tmp = 0;}
		//bill['positions']['total'][i] -= bill['positions']['total'][i]*(bill['sale'] + client_sale_tmp + bill['cert_sale'])/100;
		bill['positions']['disc'][i] = bill['sale'] + client_sale_tmp + bill['cert_sale'];
		bill['positions']['total'][i] -= Math.round(bill['positions']['total'][i]*100*bill['positions']['disc'][i]/100)/100;
	}
	if(gl_score == 1 && bill['positions']['score'][i]) {bill['score'] += Number(bill['positions']['score'][i]*bill['positions']['kol'][i]);}
	if(gl_score == 2 && bill['positions']['sale'][i] == 1) {bill['score'] += bill['positions']['total'][i]*(bill['client_sale'])/100;}
	bill['positions']['total'][i] = roundNum(bill['positions']['total'][i]);
	bill['positions']['total0'][i] = roundNum(bill['positions']['total0'][i]);
	bill['total0'] += bill['positions']['total0'][i];
	bill['total'] += bill['positions']['total'][i];
}

function billTr(i,p) {
	var basket = "";
	basket += "<tr class='tr_basket'><td align='center'>";
	if(p) {
		if(bill['positions']['mod'][i]) {basket+="<span id='ingred"+i+"' class='icon "; if(parent && parent == i) {basket += "down";} else {basket+="plus";} basket+="' onclick=\"billAddChild('"+i+"')\" title='Добавить ингредиент'></span>";}
	} else {
		basket += "<span class='icon ingred'></span>";
	}
	basket += "</td><td>"+bill['positions']['name'][i];
	if(bill['positions']['sale'][i] == 0) {basket += " <strike class='red' title='Скидки запрещены'>%</strike>";}
	basket += "</td>";
	if(!bill['order_edit'] || !gl_bill_reduction) {basket += "<td><span onclick=\"billUnBuy('"+i+"','"+bill['positions']['kol_val'][i]+"');\" class='icon billminus'></span></td>";} else {basket += "<td><span class='icon billminus dis'></span></td>";}
	basket += "<td align='center'><input ";
	if(!bill['order_edit'] || !gl_bill_reduction) {} else {basket += " info='"+bill['positions']['kol'][i]+"' ";}
	basket += " onblur=\"setKol(this,this.value,'"+i+"');\" value='"+bill['positions']['kol'][i]+"' class='input' maxlength='7' /></td><td><span onclick=\"billBuy('"+bill['positions']['productID'][i]+"','"+i+"','"+bill['positions']['kol_val'][i]+"','','','');\" class='icon billplus'></span></td><td align='center'>";
	if(bill['positions']['dp'][i]) {basket += "<input onblur=\"setPrice(this,this.value,'"+i+"');\" value='"+bill['positions']['price'][i]+"' class='input' maxlength='10' />";} else {basket += bill['positions']['price'][i];}
	basket +="</td><td align='right'>"+bill['positions']['total0'][i]+" "+currency+"</td><td></td></tr>";
	/*m*/if(mobile_basket) {$("#bill_kol_"+bill['positions']['productID'][i]).html(" x"+bill['positions']['kol_el'][bill['positions']['productID'][i]]);}
	return basket;
}

function billBasketShow(to) {
	if(dts == 1 && dts_dis == 0 && !bill['order_edit']) {bill['sale'] = Number(dtsCheck());}
	var bcount = 0;
	bill['total'] = 0;
	bill['total0'] = 0;
	bill['score'] = 0;
	var basket = "";
	for(i=0; i<=bill['positions']['productID'].length; i++) {
		if(bill['positions']['kol'][i] && bill['positions']['auto'][i] == "" && bill['positions']['parent'][i] == "" && bill['positions']['parent'][i] != "0") {
			bcount++;
			billCalcTotal(i);
			basket += billTr(i,1);
			for(p=0; p<=bill['positions']['productID'].length; p++) {
				if(bill['positions']['kol'][p] && (bill['positions']['parent'][p] || bill['positions']['parent'][p] == '0') && bill['positions']['parent'][p] == i) {
					billCalcTotal(p);
					basket += billTr(p,0);
				}
			}
		}
	}

	auto['productID'] = [];
	auto['name'] = [];
	auto['kol'] = [];
	auto['price'] = [];
	auto['vat'] = [];
	auto['excise'] = [];
	auto['auto'] = [];

	var auto_total = 0;
	for(q=0; q<auto_select.length; q++) {
		var a = 0;
		while(a < auto['productID'].length && auto['productID'][a] != auto_select[q]) a++;
		auto_total = 0;
		if(auto_select_ignore_sale[q]) {var total_auto = bill['total0'];} else {var total_auto = bill['total'];}
		if(total_auto >= auto_select_start[q] && total_auto <= auto_select_stop[q] && auto_select_pers[q] == "") {

			bcount++;

			auto['productID'][a] = auto_select[q];
			auto['name'][a] = auto_select_name[q];
			auto['kol'][a] = auto_select_kol[q];
			auto['price'][a] = auto_select_price[q];
			auto['vat'][a] = auto_select_vat[q];
			auto['excise'][a] = auto_select_excise[q];
			auto['auto'][a] = 1;

			auto_total = Math.round(auto['price'][a]*auto['kol'][a]*100)/100;
			basket+="<tr class='tr_basket' height='35'><td></td><td>"+auto['name'][a]+" <span class='grey'>[авто]</span></td><td align='center'></td><td align='center'>"+auto['kol'][a]+"</td><td align='center'></td><td align='center'>"+auto['price'][a]+"</td><td align='right'>"+auto_total+" "+currency+"</td><td></td></tr>";

		}
		if(bill['person'] > 0 && auto_select_pers[q] == 1) {
			bcount++;

			auto['productID'][a] = auto_select[q];
			auto['name'][a] = auto_select_name[q];
			auto['kol'][a] = auto_select_kol[q] * bill['person'];
			auto['price'][a] = auto_select_price[q];
			auto['vat'][a] = auto_select_vat[q];
			auto['excise'][a] = auto_select_excise[q];
			auto['auto'][a] = 1;

			auto_total = Math.round(auto['price'][a]*auto['kol'][a]*100)/100;
			basket+="<tr class='tr_basket' height='35'><td></td><td>"+auto['name'][a]+" <span class='grey'>[авто]</span></td><td align='center'></td><td align='center'>"+auto['kol'][a]+"</td><td align='center'></td><td align='center'>"+auto['price'][a]+"</td><td align='right'>"+auto_total+" "+currency+"</td><td></td></tr>";
		}
		bill['total0'] += auto_total;
		bill['total'] += auto_total;
	}


	for(i=0; i<cert['productID'].length; i++) {
		if(cert['name'][i]) {
			bcount++;
			var cert_total = Math.round(cert['price'][i]*cert['kol'][i]*100)/100;
			bill['total0'] += cert_total;
			bill['total'] += cert_total;
			basket+="<tr class='tr_basket' height='35'><td></td><td>"+cert['name'][i]+" <span class='grey'>[сертификат]</span></td><td align='center'></td><td align='center'>"+cert['kol'][i]+"</td><td align='center'></td><td align='center'>"+cert['price'][i]+"</td><td align='right'>"+cert_total+" "+currency+"</td><td></td></tr>";
		}
	}

	if(bill['margin'] > 0) {bill['margin_total'] = (bill['total'] * bill['margin'])/100; bill['total'] += bill['margin_total'];} else {bill['margin_total'] = 0;}
	if(bill['u_sale'] > 0) {if(bill['total'] >= bill['u_sale']) {bill['total'] -= bill['u_sale'];} else {setSale(0);}}
	if(bill['cert_amount'] > 0) {bill['total'] -= bill['cert_amount'];}
	if(bill['totalS'] > 0) {if(bill['total'] >= bill['totalS']) {bill['total'] -= bill['totalS'];} else {scorePaySet(0);}}

	if(bcount > 0) {
		if(gl_score == 4 && gl_score_amount > 0 && bill['total'] > 0) {bill['score'] = bill['total']*(gl_score_amount)/100;}
		$("#bill_sale_block").html("");
		if(bill['sale'] > 0) {
			$("#bill_sale_block").append("<span onclick='setSale(0);' class='basket_red' title='Скидка на заказ'>-"+bill['sale']+"%</span>");
		}
		if(bill['u_sale'] > 0) {
			$("#bill_sale_block").append("<span onclick='setSale(0);' class='basket_red' title='Скидка на заказ'>-"+bill['u_sale']+" "+currency+"</span>");
		}
		if(bill['client_sale'] > 0 && !gl_score_sale_block) {
			$("#bill_sale_block").append("<span onclick='unsetClientSale();' class='basket_red' title='Скидка клиента'>-"+bill['client_sale']+"%</span>");
		}
		if(bill['cert_sale'] > 0) {
			$("#bill_sale_block").append("<span onclick=\"searchCertificate('break');\" class='basket_red' title='Скидка по сертификату'>-"+bill['cert_sale']+"%</span>");
		}
		if(bill['cert_amount'] > 0) {
			$("#bill_sale_block").append("<span onclick=\"searchCertificate('break');\" class='basket_red' title='Скидка по сертификату'>-"+bill['cert_amount']+" "+currency+"</span>");
		}
		if(bill['margin'] > 0) {
			$("#bill_sale_block").append("<span onclick='setMargin(0);' class='basket_red' title='Наценка на заказ'>+"+bill['margin']+"%</span>");
		}
		if(bill['totalS'] > 0) {
			$("#bill_sale_block").append("<span onclick='scorePaySet(0);' class='basket_red' title='Оплата с лицевого счета'>-"+bill['totalS']+" "+currency+"</span>");
		}
		if(bill['total0'] > 0) {
			bill['total0'] = Math.round(bill['total0']*100)/100;
			basket+="<tr class='tr_basket' height='35'><td></td><td><b>Всего</b></td><td colspan='3'></td><td></td><td align='right'><b>"+bill['total0']+" "+currency+"</b></td><td></td></tr>";
		}
		if(bill['score_old'] == "edit") {
			bill['score'] = Math.round(bill['score']*100)/100;
			bill['score_old'] = bill['score'];
			if(gl_score_add_block) {
				if(bill['totalS_old']) {
					bill['score_old'] = 0;
				} else {
					bill['client_score'] -= bill['score_old'];
				}
			} else {
				bill['client_score'] -= bill['score_old'];
			}
		}
		if(bill['totalS'] > 0 && gl_score_add_block) {bill['score'] = 0;}
		if(bill['score'] > 0) {
			bill['score'] = Math.round(bill['score']*100)/100;
			basket+="<tr class='tr_basket' height='35'><td></td><td>Баллы за заказ</td><td colspan='3'></td><td></td><td align='right'>"+bill['score']+"</td><td></td></tr>";
		}

		if(bill['client_score'] > 0 || bill['totalS'] > 0) {
			var client_score_show = 0;
			if(bill['totalS_old'] > 0) {
				if($("#billPhone").val() == bill['phone_old']) {
					if(gl_score_add_block) {
						client_score_show = Number(bill['client_score']) + Number(bill['totalS_old']);
					} else {
						client_score_show = Number(bill['client_score']);
					}
				} else {
					client_score_show = bill['client_score'];
				}
			} else {
				client_score_show = bill['client_score'];
			}
			client_score_show = Math.round(client_score_show*100)/100;
			if(gl_score_limit > 0) {var tmp = Math.round(bill['total']/100*gl_score_limit*100)/100;} else {var tmp = 0;}
			$("#bill_client_score").show().attr("onclick","scorePay("+client_score_show+","+tmp+");");
			$("#bill_client_score .mb").html(client_score_show).show();
		} else {
			$("#bill_client_score").hide().attr("onclick","");
			$("#bill_client_score .mb").html("").hide();
		}

		basket+="</table>";

		bill['total0'] = Math.round(bill['total0']*100)/100;
		bill['total'] = Math.round(bill['total']*100)/100;
		if(gs_bill_round && !ca) {bill['total'] = Math.floor(bill['total']);}
		if(!bill['total'] || bill['total'] < 0) {bill['total'] = '0';}
		$("#bill_total").html(bill['total']);

		if(to == 'basket' && !mobile_basket) {tabSelect('front_tabs','tab_bill');}

		$("#billBasket").html(basket);
		$("#billButtons").show();
		/*m*/$("#mbasket").html(bill['total']).show();
	} else {
		$("#billBasket").html("");
		$("#billButtons").hide();
		/*m*/$("#mbasket").html("").hide();
	}
}

function orderSave() {
	if(order_count <= order_limit) {
		if(ca) {
			surrenderShow(bill['total']);
		} else {
			if(surrender) {
				surrenderShow();
			} else {
				orderSend();
			}
		}
	} else {
		loadingHide();
		popupShow("<h2 align='center'>Превышен лимит заказов</h2><p align='center'>Увеличьте лимит в разделе \"Лицевой счет\" или перейдите на платный тариф.<br />Если вы уже выбрали тариф или увеличили лимит заказов - перезапустите программу.</p><p class='popup_buttons'><span onclick='windowClose();' class='btn grey'>Закрыть</span></p>");
	}
}

function orderSend(t,s) {
	loadingShow();
	for(i=0; i<=bill['positions']['productID'].length; i++) {
		if(bill['positions']['parent'][i] != "" || bill['positions']['parent'][i] == "0") {
			bill['positions']['parID'][bill['positions']['parent'][i]] = bill['positions']['parent'][i];
		}
	}
	if($("#billTable")) {
		bill['table'] = "";
		$("#billTable div").each(function(n,el) {
			if($(el).hasClass("selected")) {
				bill['table'] = $(el).html();
			}
		});
	}
	bill['pay'] = $("#billPay option:selected").val();
	if($("#billPoint")) {bill['point'] = $("#billPoint option:selected").val();}
	if($("#billChannel")) {bill['channel'] = $("#billChannel option:selected").val();}
	bill['datetime'] = $("#billDatetime").val();
	bill['card'] = $("#billCard").val();
	bill['phone'] = encodeURIComponent($("#billPhone").val());
	bill['name'] = $("#billName").val();
	bill['street'] = $("#billStreet").val();
	bill['home'] = $("#billHome").val();
	bill['pod'] = $("#billPod").val();
	bill['et'] = $("#billEt").val();
	bill['kvart'] = $("#billKvart").val();
	bill['descr'] = $("#billDescr").val();
	if($("#billEmail")) {bill['email'] = $("#billEmail").val();}
	bill['tags'] = "";
	$("#billTag span").each(function(n,el) {
		if($(el).hasClass("selected")) {
			var tmp = $(el).attr('id').split("tag_");
			bill['tags'] += tmp[1]+",";
		}
	});
	if($("#new_address").hasClass("selected")) {bill['new_address'] = 1;} else {bill['new_address'] = "";}
	if($("#update_client").hasClass("selected")) {bill['update_client'] = 1;} else {bill['update_client'] = "";}
	if(t && s) {
		bill['fr'] = 5;
		windowClose();
		if(t == 'cash') {bill['pay'] = 1;} else if(t = 'cashles') {bill['pay'] = 2;}
	} else {
		bill['fr'] = "";
	}

	bill['positions']['productID'] = bill['positions']['productID'].concat(auto['productID']);
	bill['positions']['name'] = bill['positions']['name'].concat(auto['name']);
	bill['positions']['kol'] = bill['positions']['kol'].concat(auto['kol']);
	bill['positions']['price'] = bill['positions']['price'].concat(auto['price']);
	bill['positions']['auto'] = bill['positions']['auto'].concat(auto['auto']);

	bill['positions']['productID'] = bill['positions']['productID'].concat(cert['productID']);
	bill['positions']['name'] = bill['positions']['name'].concat(cert['name']);
	bill['positions']['kol'] = bill['positions']['kol'].concat(cert['kol']);
	bill['positions']['price'] = bill['positions']['price'].concat(cert['price']);
	bill['positions']['auto'] = bill['positions']['auto'].concat(cert['auto']);

	bill['positions']['name'] = encodeURIComponent(bill['positions']['name']);
	if(mobile_basket) {url = "../blocks/function/orders.php";} else {url = "blocks/function/orders.php";}
	$.post(url, "order_edit="+bill['order_edit']+"&data="+JSON.stringify(bill),
		function result(data) {
			statusShow(data);
			loadingHide();
			var r = eval("("+data+")");
			if(r && r.result) {
				if(r.result == "success") {
					if(gs_print_quick) {
						menu('front','');
						if(!mobile_basket) {
							orderPrint(r.order_id,gs_print_quick);
						}
					} else {
						billBasketClear();
						if(gs_jump_to_order) {menu('orders','orders');}
					}
				}
				if(r.cash && r.cash == "close") {
					popupShow("<h2 align='center'>Ошибка</h2><p align='center'>Смена закрыта</p><p class='popup_buttons'><span onclick=\"sendPar('cashbox','cashbox_time=open&filter_affiliate="+r.affiliateID+"'); windowClose();\" class='btn save'>Открыть</span><span onclick='windowClose();' class='btn grey'>Закрыть</span></p>");
				}
			}
		}
	);
}

function orderLoad(id,copy) {
	loadingShow();
	billBasketClear();
	if(mobile_basket) {url = "../blocks/function/orders.php";} else {url = "blocks/function/orders.php";}
	$.post(url,"order_load="+id+"&copy="+copy,
	function result(data) {
		if(data) {
			loadingHide();
			var r = eval("("+data+")");
			if(r && r.result == "error") {
				statusShow(data);
			} else {
				if(!copy) {bill['order_edit'] = id;}
				bill['score_old'] = "edit";
				bill['phone_old'] = r.phone;

				billLoadItem(data);
				billLoadCert(data);
				billLoadField(data);
				billLoadClient(data,1);
				//billLoadAddress(data);
				billBasketShow('basket');

				$("#main").children().hide();
				$("#front").show();

				if(copy == 2) {
					if(ca) {
						if(r.pay == 1) {t = "cash";} else {t = "cashles";}
						s = bill['total'];
						refoundShow(t,s,id);
					} else {
						billBasketClear();
						popupShow("<h2 align='center'>Ошибка</h2><p align='center'>Фискальный регистратор не подключен</p><p class='popup_buttons'><span onclick='windowClose();' class='btn grey'>Закрыть</span></p>");
					}
				}
			}
		} else {
			loadingHide();
			statusShow();
		}
	});
}

function billLoadItem(r) {
	var d = eval("("+r+")");
	if(d && d.positions.productID) {
		bill['positions']['productID'] = d.positions.productID;
		bill['positions']['name'] = d.positions.name;
		bill['positions']['kol'] = d.positions.kol;
		bill['positions']['kol_val'] = d.positions.kol_val;
		bill['positions']['kol_el'] = d.positions.kol_el;
		bill['positions']['price'] = d.positions.price;
		bill['positions']['total'] = [];
		bill['positions']['total0'] = [];
		bill['positions']['sale'] = d.positions.sale;
		bill['positions']['disc'] = [];
		bill['positions']['mod'] = d.positions.mod;
		bill['positions']['parent'] = d.positions.parent;
		bill['positions']['score'] = d.positions.score;
		bill['positions']['dp'] = d.positions.dp;
		bill['positions']['auto'] = d.positions.auto;
		bill['positions']['vat'] = d.positions.vat;
		bill['positions']['hash'] = d.positions.hash;
		bill['positions']['excise'] = d.positions.excise;
	} else {
		for(i in bill['positions']['productID']) {billDelComp(i);}
		bill['positions']['productID'] = [];
		bill['positions']['name'] = [];
		bill['positions']['kol'] = [];
		bill['positions']['kol_val'] = [];
		bill['positions']['kol_el'] = {};
		bill['positions']['price'] = [];
		bill['positions']['total'] = [];
		bill['positions']['total0'] = [];
		bill['positions']['sale'] = [];
		bill['positions']['disc'] = [];
		bill['positions']['mod'] = [];
		bill['positions']['parID'] = [];
		bill['positions']['parent'] = [];
		bill['positions']['score'] = [];
		bill['positions']['dp'] = [];
		bill['positions']['auto'] = [];
		bill['positions']['hash'] = [];
		bill['positions']['excise'] = [];
	}
}

function billLoadCert(r) {
	var d = eval("("+r+")");
	if(d && (d.cert_productID || d.cert_sale || d.cert_amount)) {
		if(d.cert_productID) {
			cert['productID']= d.cert_productID;
			cert['name'] = d.cert_name;
			cert['kol'] = d.cert_kol;
			cert['price'] = d.cert_price;
			cert['vat'] = d.cert_vat;
			cert['excise'] = d.cert_excise;
			cert['auto'] = 2;
		}
		if(d.cert_sale > 0) {bill['cert_sale'] = Number(d.cert_sale);}
		if(d.cert_amount > 0) {bill['cert_amount'] = Number(d.cert_amount);}
		if(d.certificate) {bill['certificate'] = d.certificate; $("#billCertificate").val(d.certificate);}

	} else {
		cert['productID'] = [];
		cert['name'] = [];
		cert['kol'] = [];
		cert['price'] = [];
		cert['vat'] = [];
		cert['excise'] = [];
		bill['cert_sale'] = 0;
		bill['cert_amount'] = 0;
		$("#billCertificate").val("");
		bill['certificate'] = "";
	}
}

function billLoadField(r) {
	var d = eval("("+r+")");
	if(d && d.datetime) {$("#billDatetime").val(d.datetime);} else {$("#billDatetime").val("");}
	if(d && d.point) {setSelectSelected('billPoint', d.point); } else {setSelectSelected('billPoint');}
	if(d && d.totalS > 0) {bill['totalS'] = bill['totalS_old'] = Number(d.totalS);} else {bill['totalS'] = 0;}
	if(d && d.sale > 0) {bill['sale'] = Number(d.sale); setButtonSelected('billSale', "-"+d.sale+"%");} else {bill['sale'] = 0; setButtonSelected('billSale');}
	if(d && d.u_sale > 0) {bill['u_sale'] = Number(d.u_sale);} else {bill['u_sale'] = 0;}
	if(d && d.margin > 0) {bill['margin'] = Number(d.margin); setButtonSelected('billMargin', "+"+d.margin+"%");} else {bill['margin'] = 0; setButtonSelected('billMargin');}
	if(d && d.person) {bill['person'] = d.person; setButtonSelected('billPerson', d.person); $("#bill_person .mb").html(d.person).show();} else {bill['person'] = ""; setButtonSelected('billPerson'); $("#bill_person .mb").html("").hide();}
	if(d && d.table) {setButtonSelected('billTable', d.table);} else {setButtonSelected('billTable');}
	if(d && d.descr) {$("#billDescr").val(d.descr);} else {$("#billDescr").val("");}
	if(d && d.email) {
		$("#billEmail").val(d.email).attr("disabled","disabled");
	} else {
		$("#billEmail").val("").attr("disabled","");
	}
	if(d && d.pay) {setSelectSelected('billPay', d.pay);} else {if(pay_type_auto) {setSelectSelected('billPay', pay_type_auto);} else {setSelectSelected('billPay');}}
	if(d && d.tags) {
		var tmp_tags = d.tags.split(',');
		for(i=0; i<=tmp_tags.length; i++) {
			if($("#billTag #tag_"+tmp_tags[i])) {
				$("#billTag #tag_"+tmp_tags[i]).addClass("selected");
			}
		}
	} else {
		$("#billTag span").each(function(n,el) {$(el).removeClass('selected');});
	}
	if(!mobile_basket) {frontProductAffiliateSelect();}
}

function billLoadClient(r,p) {
	var d = eval("("+r+")");
	if(d && d.clientID) {
		bill['clientID'] = d.clientID;
		var tmp = "<div class='tooltip_list'>";
		/*m*/if(!mobile_basket) {tmp += "<div onclick=\"popup('client_stat','client_stat="+d.clientID+"'); tooltip('bill_client_options',this);\" class='item'><span class='icon stat'></span>Статистика клиента</div>";}
		if(d.parent) {tmp += "<div onclick=\"showDopAdressList('"+d.clientID+"'); tooltip('bill_client_options',this);\" class='item'><span class='icon list'></span>Другие адреса</div>";}
		if(d.street) {tmp += "<div id='new_address' onclick=\"btnSelect(this);\" class='item'><span class='icon plus'></span></span>Добавить адрес</div>";}
		tmp += "<div id='update_client' onclick=\"btnSelect(this);\" class='item'><span class='icon refresh'></span></span>Обновить данные</div>";
		tmp += "<div onclick=\"billLoadClient();\" class='item'><span class='icon delete'></span>Открепить клиента</div>";
		tmp += "</div>";
		$("#bill_client_options").attr("style","");
		$("#bill_client_options .tooltip_content").html(tmp).attr("style","");
		$("#bill_client_buttons").html("<span></span><span onclick=\"tooltip('bill_client_options',this);\" class='icon more'><span></span></span>");
	} else {$("#bill_client_options .tooltip_content, #bill_client_buttons").html("");$("#bill_client_options").hide(); bill['clientID'] = "";}
	if(d && d.parent) {} else {$("#dop_address_list").html("");}
	if(d && d.channel) {setSelectSelected('billChannel', d.channel);} else {setSelectSelected('billChannel');}
	if(d && d.name) {$("#billName").val(d.name).attr("disabled","disabled"); $("#billNameTr").show();} else {$("#billName").val("").attr("disabled",""); if(gs_show_client_name == '1') {$("#billNameTr").show();} else {	$("#billNameTr").hide();}}
	if(d && d.client_descr) {$("#billClientDescr").html(d.client_descr); $("#billClientDescrTr").show();} else {$("#billClientDescr").html(""); $("#billClientDescrTr").hide();}
	if(d && d.card) {$("#billCard").val(d.card).attr("disabled","disabled");bill['card']=d.card;} else {$("#billCard").val("").attr("disabled","");bill['card']="";}
	if(d && d.phone) {
		$("#billPhone").val(d.phone);
		if(bill['score_old'] > 0 && bill['phone_old'] == d.phone) {bill['score_old'] = "edit";}
	} else {$("#billPhone").val("");}
	if(d && d.email) {$("#billEmail").val(d.email);} else {$("#billEmail").val("");}
	billLoadSale(r);
	if(!r || !p) {bill['totalS'] = 0;}
	billLoadAddress(r);
}

function billLoadSale(r) {
	var d = eval("("+r+")");
	if(d && d.client_sale > 0) {bill['client_sale'] = Number(d.client_sale);} else {bill['client_sale'] = 0;}
	if(d && d.client_score > 0) {bill['client_score'] = Number(d.client_score);} else {bill['client_score'] = 0; if(!r) {bill['totalS'] = 0;}}
	if(!r) {billBasketShow();}
}

function billLoadAddress(r) {
	var d = eval("("+r+")");
	if(d && d.street) {$("#billStreet").val(d.street);} else {$("#billStreet").val("");}
	if(d && d.home) {$("#billHome").val(d.home);} else {$("#billHome").val("");}
	if(d && d.pod) {$("#billPod").val(d.pod);} else {$("#billPod").val("");}
	if(d && d.et) {$("#billEt").val(d.et);} else {$("#billEt").val("");}
	if(d && d.kvart) {$("#billKvart").val(d.kvart);} else {$("#billKvart").val("");}
	$('#dop_address_list').html("").hide();
	billBasketShow();
}

function showDopAdressList(id) {
	if($("#dop_address_list").is(":visible") == false) {
		$('#dop_address_list').html("<p align='center'>Загрузка...</p>").show();
		if(mobile_basket) {url = "../blocks/function/client.php";} else {url = "blocks/function/client.php";}
		$.post(url,"search_dop_address="+id,
			function result(data) {
				if(data) {
					var response = eval("("+data+")");
					if(response) {
						var ul = document.createElement("ul");
						var num = response['text'].length;
						for(var i=0; i < num; i++) {
							var li = document.createElement("li");
							li.innerHTML = response['text'][i];
							if(response['func'] && response['func'][i]) {li.setAttribute("onclick","billLoadAddress('"+response['func'][i]+"')");}
							ul.appendChild(li);
						}
						$('#dop_address_list').html(ul);
					}
				}
			}
		);
	} else {
		$('#dop_address_list').hide();
	}
}

function unsetClientSale() {
	bill['client_sale'] = 0;
	billBasketShow();
}

function billBasketClear() {
	bill['order_edit'] = "";
	bill['phone_old'] = "";
	bill['score_old'] = 0;
	bill['totalS_old'] = 0;
	parent = "";
	dts_dis = 0;

	billLoadItem();
	billLoadCert();
	billLoadField();
	billLoadClient();

	setButtonSelected('billTag');

	billBasketShow();
	$("#bill_sale_tooltip").hide();
	$("#bill_persons_tooltip").hide();
	if(!mobile_basket) {frontProductAffiliateSelect();}
}

function setSale(v) {
	if(v == 'value') {
		$("#bill_sale_tooltip").hide();
		popupShow("<h2 align='center'>Скидка суммой</h2><p align='center'>Скидка <input id='bill_amount_sale' size='10' class='input' onkeydown=\"if(event.keyCode==13){setAmountSale();}\"/> "+currency+"</p><p class='popup_buttons'><span onclick='setAmountSale();' class='btn save'>Применить</span><span onclick='windowClose();' class='btn grey'>Отмена</span></p>");
		$("#bill_amount_sale").focus();
	} else {
		dts_dis = 1;
		bill['u_sale'] = 0;
		bill['sale'] = Number(v);
		setButtonSelected('billSale',"-"+v+"%");
		$("#bill_sale_tooltip").hide();
		billBasketShow();
	}
}

function setAmountSale() {
	bill['u_sale'] = $('#bill_amount_sale').val();
	bill['sale'] = 0;
	if(isNaN(bill['u_sale'])) {
		bill['u_sale'] = 0;
		billBasketShow();
		windowClose();
	} else {

		if(bill['u_sale'] > bill['total']) {bill['u_sale'] = bill['total'];}
		bill['u_sale'] = Math.round(bill['u_sale']*100)/100;
		setButtonSelected('billSale',"Cуммой");
		billBasketShow();
		windowClose();
	}
}

function setMargin(v) {
	bill['margin'] = Number(v);
	if(v == 0) {bill['margin_total'] = 0;}
	setButtonSelected('billMargin',"+"+v+"%");
	$("#bill_sale_tooltip").hide();
	billBasketShow();
}

function setPers(v) {
	setButtonSelected('billPerson',v);
	bill['person'] = Number(v);
	if(v && v > 0) {
		$("#bill_person .mb").html(v).show();
	} else {
		$("#bill_person .mb").html("").hide();
	}
	billBasketShow();
}

function setKol(el,value,i) {
	value = setDot(value);
	value = Math.round(value*1000)/1000;
	if(isNaN(value)) {
		billBasketShow();
		popupShow("<h2 align='center'>Ошибка</h2><p align='center'>Можно вводить только числа</p><p class='popup_buttons'><span onclick='windowClose();' class='btn grey'>Закрыть</span></p>");
	} else {
		if($(el).attr('info') && $(el).attr('info') > value) {
			popupShow("<h2 align='center'>Ошибка</h2><p align='center'>Запрещено уменьшать количество при изменении заказа</p><p class='popup_buttons'><span onclick='windowClose();' class='btn grey'>Закрыть</span></p>");
			billBasketShow();
		} else {
			if(value < 0) {value = 0; billUnBuy(i);}
			bill['positions']['kol'][i] = value;
			bill['positions']['kol_el'][bill['positions']['productID'][i]] = value;
			$(el).val(value);
			billBasketShow();
		}
	}
}

function setPrice(el,value,i) {
	value = setDot(value);
	value = Math.round(value*100)/100;
	if(isNaN(value)) {
		billBasketShow();
		popupShow("<h2 align='center'>Ошибка</h2><p align='center'>Можно вводить только числа</p><p class='popup_buttons'><span onclick='windowClose();' class='btn grey'>Закрыть</span></p>");
	} else {
		if(value < 0) {value = 0;}
		bill['positions']['price'][i] = value;
		$(el).val(value);
		billBasketShow();
	}
}

function refoundShow(t,s,id) {
	popupShow("<h2 align='center'>Возврат</h2><p align='center'>Сумма "+bill['total']+" "+currency+"</p><p class='popup_buttons'><span onclick=\"cr('"+t+"','"+s+"','"+id+"');\" class='btn save'>Возврат</span><span onclick=\"menu('front','');windowClose();\" class='btn grey'>Отмена</span></p>");
}

function surrenderShow(t) {
	var tmp = "<h2 align='center'>Расчет сдачи</h2>\
	<p>\
	<table width='350' border='0' cellpadding='0' cellspacing='10' style='font-size:15px;'>\
	<tr><td width='100'>Итого</td><td>"+bill['total']+" "+currency+"</td></tr>\
	<tr><td>Внесено</td><td><input id='surrender_amount' onkeyup='surrenderCalc();' class='input' style='width:100px; font-size:16px;' /></td></tr>\
	<tr><td colspan='2' align='center'>\
	<div class='surrender_key'>\
	<table width='100%'>\
	<tr><td><div class='item' onclick=\"surrenderKeyAdd('7')\">7</div></td><td><div class='item' onclick=\"surrenderKeyAdd('8')\">8</div></td><td><div class='item' onclick=\"surrenderKeyAdd('9')\">9</div></td><td><div class='item' onclick=\"surrenderKeyAdd('5000')\">5000</div></td></tr>\
	<tr><td><div class='item' onclick=\"surrenderKeyAdd('4')\">4</div></td><td><div class='item' onclick=\"surrenderKeyAdd('5')\">5</div></td><td><div class='item' onclick=\"surrenderKeyAdd('6')\">6</div></td><td><div class='item' onclick=\"surrenderKeyAdd('2000')\">2000</div></td></tr>\
	<tr><td><div class='item' onclick=\"surrenderKeyAdd('1')\">1</div></td><td><div class='item' onclick=\"surrenderKeyAdd('2')\">2</div></td><td><div class='item' onclick=\"surrenderKeyAdd('3')\">3</div></td><td><div class='item' onclick=\"surrenderKeyAdd('1000')\">1000</div></td></tr>\
	<tr><td></td><td><div class='item' onclick=\"surrenderKeyAdd('0')\">0</div></td><td><div class='item c' onclick=\"surrenderKeyAdd('c')\">C</div></td><td><div class='item' onclick=\"surrenderKeyAdd('500')\">500</div></td></tr>\
	</table>\
	</div>\
	</td></tr>\
	<tr><td>Сдача</td><td><b id='surrender_val' class='surrender_amount2'></b></td></tr>";
	if(ce) {
		tmp += "<tr><td>Эл. чек <span class='icon help' onclick=\"$('#help_email_phone').show();\" style='margin-top:-1px;'></span><div id='help_email_phone' class='help_popup'>Укажите телефон или email клиента, фискальный регистратор передаст эти данные в ОФД, который отправит электронный чек клиенту.<span class='help_popup_close' onclick=\"$('#help_email_phone').hide();\"></span></div></td><td><input id='email_phone' class='input' placeholder='телефон или email' onkeyup='surrenderCalc();'/></td></tr>";
		tmp += "<tr valign='middle'><td>Пречек <span class='icon help' onclick=\"$('#help_nonfiskal').show();\" style='margin-top:-1px;'></span><div id='help_nonfiskal' class='help_popup'>Печатать нефискальный чек на фискальном регистраторе.<span class='help_popup_close' onclick=\"$('#help_nonfiskal').hide();\"></span></div></td><td><input type='checkbox' id='nonfiskal' ";
		if(localStorage['nofiskal_print'] == 1) {tmp += "checked='checked'";}
		tmp += " onclick='nonfiskalPrintSave(this);' style='margin-top:2px;'></td></tr>";
	}
	tmp += "</table>\
	</p>\
	<p class='popup_buttons'><span id='surrender_save'></span>";
	if(!ca) {tmp += "<span class='btn save' onclick='surrenderSave();'>Без сдачи</span>";}
	tmp += "<span onclick=\"windowClose();\" class='btn grey'>Отмена</span></p>";
	$("#popup").html(tmp);
	$("#overlay").show();
	$("#surrender_amount").focus();
	if(t) {surrenderKeyAdd(t);}
}

function nonfiskalPrintSave(el) {
	if($(el).attr("checked") == true) {
		window.localStorage.setItem("nofiskal_print", "1");
	} else {
		window.localStorage.setItem("nofiskal_print", "");
	}
}

function surrenderKeyAdd(val) {
	if(val == "c") {
		$("#surrender_amount").val("");
		$("#surrender_amount").focus();
	} else {
		if(val < 500) {
			var tmp = $("#surrender_amount").val() + val;
		} else {
			var tmp = val;
		}
		$("#surrender_amount").val(tmp);
	}
	surrenderCalc();
}

function surrenderCalc() {
	var curCh;
	var value = $("#surrender_amount").val();
	for(var j=0; j<value.length; j++) {
		curCh = value.charAt(j);
		if (curCh == ",") {value = value.replace(/,/g, '.');}
		continue;
	}
	$("#surrender_amount").val(value);

	if(value >= bill['total'])  {
		var tmp = value - bill['total'];
		tmp = Math.round(tmp*100)/100;
		$("#surrender_val").html(tmp+" "+currency);
		if(ca) {
			if(ce) {
				var email_phone = $('#email_phone').val();
				var display = "<span onclick=\"cb('cash','"+value+"','"+email_phone+"');\" class='btn save'>Наличными</span>";
				if(gs_pay_type == 2) {display += "<span onclick=\"cb('cashles','"+value+"','"+email_phone+"');\" class='btn save'>Картой</span>";}
			} else {
				var display = "<span onclick=\"cb('cash','"+value+"');\" class='btn save'>Наличными</span>";
				if(gs_pay_type == 2) {display += "<span onclick=\"cb('cashles','"+value+"');\" class='btn save'>Картой</span>";}
			}

			display += "<span class='btn save' onclick='surrenderSave("+tmp+");'>Сохранить</span>";
			$("#surrender_save").html(display);
		} else {
			if(value > bill['total']) {
				$("#surrender_save").html("<span class='btn save' onclick=\"surrenderSave("+tmp+");\" title='Сохранить заказ с примечанием о сдаче'>Со сдачей</span>");
			}
		}
	} else {
		$("#surrender_val").html("");
		$("#surrender_save").html("");
	}
}

function surrenderSave(s) {
	if($("#nonfiskal").is(":checked")) {
		cp();
	}
	if(s) {
		s = Math.round(s*100)/100;
		$("#billDescr").val($("#billDescr").val()+" Купюра:"+$("#surrender_amount").val()+", Сдача:"+s);
		windowClose();
		orderSend();
	} else {
		windowClose();
		orderSend();
	}
}

function scorePay(s,l) {
	if(l > s) {l = s;}
	var d = "<h2 align='center'>Оплата c лицевого счета</h2><p align='center'>На счету "+s+"</p>";
	d += "<p align='center'>Списать <input id='bill_score_value' size='10' class='input' onKeyUp=\"igo_Add(this, this.value, 'bill_score_value')\" onkeydown=\"if(event.keyCode==13){scorePaySet("+l+");}\"/> "+currency+"<br /><span class='grey'>(от 1 до <span onclick=\"$('#bill_score_value').val("+l+");\" class='href'>"+l+"</span>)</span></p><p class='popup_buttons'><span onclick='scorePaySet("+l+");' class='btn save'>Применить</span><span onclick='windowClose();' class='btn grey'>Отмена</span></p>";
	popupShow(d);
	$("#bill_score_value").focus();
}

function scorePaySet(s) {
	bill['totalS'] = $("#bill_score_value").val();
	if(isNaN(bill['totalS'])) {
		bill['totalS'] = 0;
		billBasketShow();
		windowClose();
	} else {
		bill['totalS'] = Math.round(bill['totalS']*100)/100;
		if(bill['totalS'] > s) {bill['totalS'] = s;}
		if(bill['totalS'] > bill['total']) {bill['totalS'] = bill['total'];}
		billBasketShow();
		windowClose();
	}
}

function searchCard() {
	var str = $("#billCard").val();
	if(str) {
		if(mobile_basket) {url = "../blocks/function/client.php";} else {url = "blocks/function/client.php";}
		$.post(url,"search_card="+str,
			function result(data) {
				if(data) {
					bill['totalS'] = 0;
					billLoadClient(data);
					billBasketShow();
				} else {
					statusType('error','Дисконтная карта не найдена');
					$("#billCard").val("");
				}
			}
		);
	} else {
		statusType('error','Введите номер дисконтной карты');
	}
}

function searchCertificate(c) {
	if(!c) {
		c = $("#billCertificate").val();
		if(c) {
			if(bill['certificate'] != c) {
				if(mobile_basket) {url = "../blocks/function/certificate.php";} else {url = "blocks/function/certificate.php";}
				$.post(url,"search_certificate="+c,
					function result(data) {
						if(data) {
							var r = JSON.parse(data);
							if(r && r.certificate) {
								billLoadCert(data);
								billBasketShow('basket');
								statusType('success','Сертификат добавлен в заказ');
							} else {
								$("#billCertificate").val("").focus();
								statusType('error','Сертификат не найден, уже использован или просрочен');
								billBasketShow();
							}
						}
					}
				);
			} else {
				statusType('error','Повторный ввод сертификата');
			}
		} else {
			$("#billCertificate").focus();
			statusType('error','Введите номер сертификата');
		}
	} else {
		billLoadCert();
		billBasketShow();
	}
}

function billProductSearch(par) {
	if(par == '0') {
		$("#fr_search").val('').focus();
		$("#fr_search_result").hide();
	} else {
		$("#fr_search_result").hide();
		var q = $("#fr_search").val();
		if(q && q.length > 1) {
			var res = "";
			if(q) {
				var n = 1;
				if($("#billPoint option:selected").val()) {
					var a = $("#billPoint option:selected").val().split(',');
				} else {
					var a = [];
					a[0] = "";
				}
				$("#front_product_affiliate_select_"+a[0]+" [info]").each(function(){
					if($(this).attr("info").toUpperCase().indexOf(q.toUpperCase()) != -1) {
						if(n <= 10) {
							res += "<li onclick=\"billProductSearch('0');"+$(this).attr('onclick')+"\">"+$(".fr_name",this).html()+"</li>";
							n++;
						}
					}
				});
			}
			if(res) {
				$("#fr_search_result").html("<ul>"+res+"</ul>").show();
			}
		}
	}
}

function prebillList(l) {
	if(l) {
		var tmp = l.split(" ");
		for(i=0; i<tmp.length; i++) {
			var h,m=0;
			var d = "";
			h = Math.floor(tmp[i]/60);
			m =  tmp[i] - h*60;
			if(h > 0) {d = h+"ч ";}
			if(m > 0) {d += m+"м ";}
			if(h == 0) {d =  m+"м ";}
			$("#prebill_list").append("<span onclick=\"prebillSet('"+tmp[i]+"');\" class='btn grey order' style='margin:0 2px 5px 0;'>"+d+"</span> ");
			$("#tr_prebill_list").show();
		}
	}
}

function prebillSet(p) {
	var now = new Date(),
		pre = new Date(+now + p * 6e4),
		Y = pre.getFullYear(),
		M = (pre.getMonth() < 9 ? '0' : '') + (pre.getMonth()+1),
		D = (pre.getDate() < 10 ? '0' : '') + pre.getDate(),
		h = (pre.getHours() < 10 ? '0' : '') + pre.getHours(),
		m = (pre.getMinutes() < 10 ? '0' : '') + pre.getMinutes();
 	$("#billDatetime").val(D+"."+M+"."+Y+" "+h+":"+m+":00");
	billBasketShow();
}


var dts_save = {};
function dtsShow(tab) {
   if(!tab) {tab = 0;}
   var days = ["","Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
   var disp = "";
   disp += "<table border='0' cellpadding='0' cellspacing='0'>";
   disp += "<tr><td><div id='dts_tabs'>";
   for(var s=0; s<5; s++) {
      disp += "<div onclick=\"dtsSave('"+s+"');tabSelect('dts_tabs','dts_"+s+"');\" class='dts_tab ";
      if(tab == s) {disp += "selected";}
      disp += "'>Скидка</div>";
   }
   disp += "</div></td></tr>";
   disp += "<tr><td id='dts_tabsCont'>";
   for(var s=0; s<5; s++) {
      disp += "<div id='dts_"+s+"Cont' ";
      if(tab != s) {disp += "style='display:none;'";}
      disp += " >";
		disp += "<table width='100%' border='0' cellpadding='0' cellspacing='10'>";
		disp += "<tr valign='top'><td>";
      disp += "<table width='100%' border='0' cellpadding='0' cellspacing='10'>";
      disp += "<tr><td width='180'>Скидка</td><td><select id='dts_sale'>";
      for(var i=0; i<=100; i++) {
         if(dts_settings['dts'] && dts_settings['dts'][s] && dts_settings['dts'][s]['sale'] == i) {
            disp += "<option value='"+i+"' selected='selected'>"+i+"%</option>";
         } else {
            disp += "<option value='"+i+"'>"+i+"%</option>";
         }
      }
      disp += "</select></td></tr>";
		disp += "<tr><td>Применять для клиентов</td><td><select id='dts_clients'>";
		if(dts_settings['dts'] && dts_settings['dts'][s] && dts_settings['dts'][s]['clients'] == 'card') {
			disp += "<option value='all'>Всех</option>";
			disp += "<option value='card' selected='selected'>Есть карта</option>";
		} else {
			disp += "<option value='all' selected='selected'>Всех</option>";
			disp += "<option value='card'>Есть карта</option>";
		}
      disp += "</select></td></tr>";
		disp += "<tr><td>Разрешить при других скидках</td><td><select id='dts_group_sales'>";
		if(dts_settings['dts'] && dts_settings['dts'][s] && dts_settings['dts'][s]['group_sales'] == '1') {
			disp += "<option value=''>Нет</option>";
			disp += "<option value='1' selected='selected'>Да</option>";
		} else {
			disp += "<option value='' selected='selected'>Нет</option>";
			disp += "<option value='1'>Да</option>";
		}
		disp += "<tr><td>Разрешить с предзаказом</td><td><select id='dts_prebill'>";
		if(dts_settings['dts'] && dts_settings['dts'][s] && dts_settings['dts'][s]['prebill'] == '1') {
			disp += "<option value=''>Нет</option>";
			disp += "<option value='1' selected='selected'>Да</option>";
		} else {
			disp += "<option value='' selected='selected'>Нет</option>";
			disp += "<option value='1'>Да</option>";
		}
      disp += "</select></td></tr>";
		disp += "</table>";
      disp += "</td><td width='1' style='background:#ccc;'>";
		disp += "</td><td>";
      disp += "<table border='0' cellpadding='0' cellspacing='2'>";
      disp += "<tr align='center'><td width='60'></td>";
      for(var d=1; d<=7; d++) {
          disp += "<td width='27'><span style='cursor:pointer;' onclick='dtsSelectVertical("+s+","+d+");'>"+days[d]+"</span></td>";
      }
      disp += "</tr>";
      for(var h=0; h<=24; h++) {
         var a = h+1;
         disp += "<tr height='18' align='center'><td align='left'><span style='cursor:pointer;' onclick='dtsSelectHorizontal("+s+","+h+");'>"+((h<10) ? "0"+h : h)+" - "+((a<10) ? "0"+a : a)+"</span></td>";
         for(var d=1; d<=7; d++) {
            disp += "<td>";
            var ch = 0;
            //
            for(var c=0; c<5; c++) {
               if(c != s && ch != 1) {
                  if(dts_settings['dts'] && dts_settings['dts'][c] && dts_settings['dts'][c]['settings'] && dts_settings['dts'][c]['settings'][d] && dts_settings['dts'][c]['settings'][d][h]) {
                     ch = 1;
                  }
               }
            }
            if(ch == 1) {
               disp += "<input type='checkbox' checked disabled title='Скидка уже включена в другой вкладке. В одно время может действовать только одна скидка.'/>";
            } else {
               disp += "<input type='checkbox' value='1' id='dts_"+d+"_"+h+"' ";
               if(dts_settings['dts'] && dts_settings['dts'][s] && dts_settings['dts'][s]['settings'] && dts_settings['dts'][s]['settings'] && dts_settings['dts'][s]['settings'][d]) {
                  if(dts_settings['dts'][s]['settings'][d][h]) {
                     disp += "checked='checked'";
                  }
               }
               disp += " />";
            }
            disp += "</td>";
         }
         disp += "</tr>";
      }
      disp += "</table>";
      disp += "</td></tr>";
      disp += "</table>";
      disp += "</div>";
   }
   disp += "</td></tr>";
   disp += "</table>";
	disp += "</td></tr>";
	 disp += "</table>";

   $("#dts_settings").html(disp);
}

function dtsSelectVertical(s,k) {
   var c = $('#dts_'+s+'Cont #dts_'+k+'_0').is(':checked');
   for(i=0; i<24; i++) {
      if(c == true) {
         $('#dts_'+s+'Cont #dts_'+k+'_'+i).attr('checked', false);
      } else {
         $('#dts_'+s+'Cont #dts_'+k+'_'+i).attr('checked', true);
      }
   }
}

function dtsSelectHorizontal(s,k) {
   var c = $('#dts_'+s+'Cont #dts_1_'+k).is(':checked');
   for(i=1; i<8; i++) {
      if(c == true) {
         $('#dts_'+s+'Cont #dts_'+i+'_'+k).attr('checked', false);
      } else {
         $('#dts_'+s+'Cont #dts_'+i+'_'+k).attr('checked', true);
      }
   }
}

function dtsSave(tab) {
   dts_save['dts'] = [];
   $("#dts_tabsCont div").each(function(n,el) {
      var arr = {};
      arr['sale'] = 0;
      arr['settings'] = {};
      $("#"+$(el).attr('id')+" select, #"+$(el).attr('id')+" input").each(function(num,elem) {
         if($(elem).attr("id") == "dts_sale") {
            arr['sale'] = $(elem).val();
         }
			if($(elem).attr("id") == "dts_clients") {
            arr['clients'] = $(elem).val();
         }
			if($(elem).attr("id") == "dts_group_sales") {
            arr['group_sales'] = $(elem).val();
         }
			if($(elem).attr("id") == "dts_prebill") {
            arr['prebill'] = $(elem).val();
         }
         if(arr['sale'] > 0) {
            if($(elem).attr("type") == "checkbox" && $(elem).is(":checked") && $(elem).attr("id")) {
               var tmp = $(elem).attr("id").split("_");
               if(!arr['settings'][tmp[1]]) {arr['settings'][tmp[1]] = {};}
               arr['settings'][tmp[1]][tmp[2]] = 1;
            }
         }
      });
      dts_save['dts'].push(arr);
   });
   dtsShow(tab);
}

function dtsSend() {
	dtsSave(0);
	var param = "set_dts=";
	if($("#dt_sale").is(":checked")) {param += "&dts=1";}
	sendForm('noPopup','settings','settings', param+'&dts_settings='+JSON.stringify(dts_save));
}

function dtsCheck() {
	var dtime = $("#billDatetime").val();
	var ch_d, ch_h, ch_d_pre, ch_h_pre;
	if(dtime) {
		var dt = dtime.split(" ");
		var d = dt[0].split(".");
		var t = dt[1].split(":");
		var newdate = new Date(d[2], d[1]-1, d[0], t[0], t[1], t[2]);
		ch_d_pre = newdate.getDay();
	   ch_h_pre = newdate.getHours();
	}
	var now = new Date();
	ch_d = now.getDay();
	ch_h = now.getHours();

   var hit = 0;
   for(var s=0; s<5; s++) {
        for(var d=1; d<=7; d++) {
           for(var h=0; h<=24; h++) {
            if(dts_settings['dts'] && dts_settings['dts'][s]  && dts_settings['dts'][s]['settings'] && dts_settings['dts'][s]['settings'][d] && dts_settings['dts'][s]['settings'][d][h]) {
					if((dts_settings['dts'][s]['prebill'] == '1' && ((d == ch_d_pre && h == ch_h_pre) || (d == ch_d && h == ch_h && !ch_d_pre && !ch_h_pre)))	|| (dts_settings['dts'][s]['prebill'] == '' && d == ch_d && h == ch_h && !ch_d_pre && !ch_h_pre)) {
						if(dts_settings['dts'][s]['clients'] == 'all' || (dts_settings['dts'][s]['clients'] == 'card' && bill['card'])) {
							if(dts_settings['dts'][s]['group_sales'] == '1' || (dts_settings['dts'][s]['group_sales'] == '' && !bill['client_sale'] && !bill['u_sale'] && !bill['cert_sale'] && !bill['cert_amount'])) {
							   hit = dts_settings['dts'][s]['sale'];
							}
						}
               }
            }
         }
      }
   }
   return hit;
}
