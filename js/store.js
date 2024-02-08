var sbasket = {};
sbasket['id'] = [];
sbasket['product'] = [];
sbasket['name'] = [];
sbasket['kol'] = [];
sbasket['edi'] = [];
sbasket['price'] = [];
sbasket['total'] = [];
sbasket['total_all'] = 0;

function storeAdd(f,d) {
	$('#'+f+" #section_comp_select").append("<input type='radio' name='comp' data='"+d+"' checked='checked' style='display:none;'/>");
}

function sbasketGetData(f,id,u) {
	var e = $("#"+f+" input:checked").attr("data");
	var d = {};
	if(e) {
		d = JSON.parse(e);
	}
	d.kol = roundNum($("#"+f+" #calc_kol"+id).val(),3);
	d.price = roundNum($("#"+f+" #calc_price"+id).val(),2);
	d.total = roundNum($("#"+f+" #calc_total"+id).val(),2);
	if(u) {
		$("#"+f+" input:checked").parent().removeClass("selected");
		$("#"+f+" input:checked").attr("checked","");
		$("#"+f+" #calc_kol").val("");
		$("#"+f+" #calc_price").val("");
		$("#"+f+" #calc_total").val("");
	}
	return d;
}

function sbasketBuy(b,f,d,l) {
	if(!d) {var d = sbasketGetData(f,'',1);} else {d = d.replace(/\\/g, '\\\\');d = JSON.parse(d);}
	var i = 0;
	while(i < sbasket['id'].length && (sbasket['id'][i] != d.id || sbasket['product'][i] != d.product)) i++;
	if(i >= sbasket['id'].length) {
		sbasket['id'][i] = d.id;
		sbasket['name'][i] = d.name;
		sbasket['product'][i] = d.product;
		sbasket['kol'][i] = Number(d.kol);
		sbasket['edi'][i] = d.edi;
		sbasket['price'][i] = Number(d.price);
		sbasket['total'][i] = Number(d.total);
	} else {
		sbasket['kol'][i] += Number(d.kol);
		sbasket['total'][i] += Number(d.total);
	}
	sbasketShow(b,l);
	$("#"+f+" #componentSearchSel").val("").focus();
}

function sbasketShow(b,l) {
	if(l) {l = "disabled='disabled'";} else {l = "";}
	var disp = "";
	var n = 1;
	sbasket['total_all'] = 0;
	for(i=0; i <= sbasket['id'].length; i++) {
		if(b == 'mods_list') {sbasket['kol'][i] = 1;}
		if(sbasket['id'][i] && sbasket['kol'][i] > 0) {
			disp += "<tr class='tr_store' align='left'>";
			disp += "<td align='center'>"+n+"</td><td align='left'>"+sbasket['name'][i]+"</td>";
			if(b != 'mods_list') {
				disp += "<td><input id='calc_kol"+i+"' value='"+sbasket['kol'][i]+"' "; if(!l) {disp += "onblur=\"igo_Add(this, this.value, 'calc_kol"+i+"');sbasketRecalc('"+b+"','calc_kol','"+i+"');\" ";} disp += l+" /> "+sbasket['edi'][i]+"</td>";
			}
			if(b != 's_issue' && b != 's_movement' && b != 'mods_list') {
				disp += "<td><input id='calc_price"+i+"' value='"+sbasket['price'][i]+"' "; if(!l) {disp += "onblur=\"igo_Add(this, this.value, 'calc_price"+i+"');sbasketRecalc('"+b+"','calc_price','"+i+"');\" ";} disp += l+" /> "+currency+"</td>";
				disp += "<td align='center'><input id='calc_total"+i+"' value='"+sbasket['total'][i]+"' "; if(!l) {disp += "onblur=\"igo_Add(this, this.value, 'calc_total"+i+"');sbasketRecalc('"+b+"','calc_total','"+i+"');\" ";} disp += l+" /> "+currency+"</td>";
			}
			disp += "<td align='center'>";
			if(!l) {disp += "<span id='noprint' onclick=\"sbasketClear('"+b+"','"+i+"')\" class='href red'>X</span>";}
			disp += "</td></tr>";
			sbasket['total_all'] += sbasket['total'][i];
			n++;
		}
	}
	if(n > 1) {
		if(b != 's_issue' && b != 's_movement' && b != 'mods_list') {
			sbasket['total_all'] = roundNum(sbasket['total_all']);
			disp += "<tr class='tr_store_total'><td></td><td>Итого</td><td></td><td></td><td align='right'>"+sbasket['total_all']+" "+currency+"</td><td></td></tr>";
		}
		$("#"+b+"_save").show();
	} else {
		$("#"+b+"_save").hide();
	}
	$("#"+b+"_content").html(disp);
}

function sbasketRecalc(b,e,i) {
	var d = sbasketGetData(b+"_content",i);
	if(d.kol && !d.price && e == "calc_kol") {
		sbasket['kol'][i] = d.kol;
	}
	if(d.kol && d.price && e != "calc_total") {
		sbasket['kol'][i] = d.kol;
		sbasket['price'][i] = d.price;
		sbasket['total'][i] = roundNum(d.kol*d.price,3);
	}
	if(d.kol && d.total && e == "calc_total") {
		sbasket['kol'][i] = d.kol;
		sbasket['total'][i] = d.total;
		sbasket['price'][i] = roundNum(d.total/d.kol);
	}
	sbasketShow(b);
}

function storeRecalc(f,e) {
	var d = sbasketGetData(f,'');
	if(d.kol && d.price && e != "calc_total") {
		$("#"+f+" #calc_total").val(roundNum(d.kol*d.price,3));
	}
	if(d.kol && d.total && e == "calc_total") {
		$("#"+f+" #calc_price").val(roundNum(d.total/d.kol));
	}
}

function sbasketClear(b,i) {
	if(i) {
		delete(sbasket['id'][i]);
		delete(sbasket['product'][i]);
		delete(sbasket['name'][i]);
		delete(sbasket['kol'][i]);
		delete(sbasket['edi'][i]);
		delete(sbasket['price'][i]);
		delete(sbasket['total'][i]);
	} else {
		sbasket['id'] = [];
		sbasket['product'] = [];
		sbasket['name'] = [];
		sbasket['kol'] = [];
		sbasket['edi'] = [];
		sbasket['price'] = [];
		sbasket['total'] = [];
		sbasket['total_all'] = 0;
	}
	sbasketShow(b);
}

function sbasketSave(b,p) {
	loadingShow();
	var str = "";
	$("#form_"+b+" input, #form_"+b+" select, #form_"+b+" textarea").each(function(n,element) {
		if($(element).attr("type") != "button") {
			str += $(element).attr('id')+"="+encodeURIComponent($(element).val())+"&";
		}
	})
	var data = JSON.stringify(sbasket).replace('&', ' ');
	$.post("blocks/function/"+b+".php","data="+data+"&"+str,
		function result(data) {
			loadingHide();
			statusShow(data);
			menu(b,b,p);
		}
	);
}





















var order = [];
var order_name = [];
var order_kol = [];
var order_price = [];
var order_edi = [];
var order_product = [];
var order_total = [];

function storeOrder(form,id,par) {
	var comp_sel;
	if(!id) {
		comp_sel = $("#"+form+" input:checked").attr("id");
	} else {
		i = id;
		order_kol[i] = Math.round($("#"+form+" #calc_kol"+i).val()*1000)/1000;
		order_price[i] = Math.round($("#"+form+" #calc_price"+i).val()*1000)/1000;
		order_total[i] = Math.round($("#"+form+" #calc_total"+i).val()*1000)/1000;
	}
	if(comp_sel) {
		var i = 0;
		while(i < order.length && (order[i] != comp_sel || order_product[i] != par)) i++;

		if(!order_kol[i]) {order_kol[i] = 0;}
		if(!order_price[i]) {order_price[i] = 0;}
		if(!order_total[i]) {order_total[i] = 0;}

		if(i >= order.length) {
			order[i] = comp_sel;
			order_name[i] = $("#"+form+" input:checked").val();
			order_edi[i] = $("#"+form+" input:checked").attr("info");
			order_kol[i] = Math.round($("#"+form+" #calc_kol"+id).val()*1000)/1000;
			order_price[i] = Math.round($("#"+form+" #calc_price"+id).val()*1000)/1000;
			order_total[i] = Math.round($("#"+form+" #calc_total"+id).val()*1000)/1000;
			if(par == 1) {order_product[i] = 1;} else {order_product[i] = 0;}
		} else {
			order_kol[i] = order_kol[i] + Math.round($("#"+form+" #calc_kol"+id).val()*1000)/1000;
			order_total[i] = order_total[i] + Math.round($("#"+form+" #calc_total"+id).val()*1000)/1000;
		}
	}

	storeOrderShow();
	if(!id) {
		$("#"+form+" input:checked").parent().removeClass("current");
		$("#"+form+" input:checked").attr("checked","");
		$("#"+form+" #calc_kol").val("");
		$("#"+form+" #calc_price").val("");
		$("#"+form+" #calc_total").val("");
	}
}

function storeOrderShow(block) {
	if(block) {block = "disabled='disabled'";}
	var display = "";
	var total = 0;
	var bcount = 0;
	var n = 1;
	for(i=0; i <= order.length; i++) {
		if(order[i] && order_kol[i] > 0) {
			total += order_total[i];
			display += "<tr class='tr_store' align='left'>";
			display += "<td align='center'>"+n+"</td><td align='left'>"+order_name[i]+"</td>";
			display += "<td><input id='calc_kol"+i+"' value='"+order_kol[i]+"' onblur=\"igo_Add(this, this.value, 'calc_kol"+i+"'); calcTotal('form_store_order','"+i+"','calc_kol','1','"+order_product[i]+"');\" "+block+" /><input type='hidden' id='calc_id"+i+"' value='"+order[i]+"' /><input type='hidden' id='calc_product"+i+"' value='"+order_product[i]+"'> "+order_edi[i]+"</td>";
			display += "<td><input id='calc_price"+i+"' value='"+order_price[i]+"' onblur=\"igo_Add(this, this.value, 'calc_price"+i+"'); calcTotal('form_store_order','"+i+"','calc_price','1','"+order_product[i]+"');\" "+block+" /> "+currency+"</td>";
			display += "<td align='center'><input id='calc_total"+i+"' value='"+order_total[i]+"' onblur=\"igo_Add(this, this.value, 'calc_total"+i+"'); calcTotal('form_store_order','"+i+"','calc_total','1','"+order_product[i]+"');\" "+block+" /> "+currency+"</td>";
			display += "<td align='center'>";
			if(!block) {display += "<span id='noprint' onclick=\"storeOrderClear('"+i+"')\" class='href red'>X</span>";}
			display += "</td></tr>";
			bcount = bcount+","+i;
			n++;
		}
	}
	if(bcount != 0) {
		total = Math.round(total*100)/100;
		display+="<tr class='tr_store_total'><td></td><td>Итого</td><td></td><td></td><td align='right'>"+total+" "+currency+"<input type='hidden' id='total' name='total' value="+total+"><input type='hidden' id='bcount' name='bcount' value='"+bcount+"'></td><td></td></tr>";
		$("#s_order_save").show();
	} else {
		$("#s_order_save").hide();
	}
	$("#content_store_order").html(display);
}

function storeOrderClear(i) {
	if(i) {
		delete(order[i]); delete(order_name[i]); delete(order_kol[i]); delete(order_price[i]); delete(order_edi[i]); delete(order_total[i]);
	} else {
		for(i=0; i <= order.length; i++) {delete(order[i]); delete(order_name[i]); delete(order_kol[i]); delete(order_kol[i]); delete(order_edi[i]); delete(order_total[i]);}
		delete(bcount);
	}
	storeOrderShow();
}

function storeOrderCont(id) {
	$("#content_store_order").html("<tr height='70'><td colspan='5' align='center'>Загрузка...</td></tr>");
	$.post("blocks/function/s_orders.php","s_order_cont="+id,
		function result(data) {
			storeOrderShow();
		}, "script"
	);
}

function calcTotal(form,id,elem,upd,par) {
	var kol = Math.round($("#"+form+" #calc_kol"+id).val()*1000);
	var price = Math.round($("#"+form+" #calc_price"+id).val()*1000);
	var total = Math.round($("#"+form+" #calc_total"+id).val()*1000);
	if(kol && price && elem+""+id != "calc_total"+id) {
		var pr = Math.round(((kol*price)/1000000)*100)/100;
		$("#"+form+" #calc_total"+id).val(pr);
	}
	if(kol && total && elem+""+id != "calc_price"+id && elem+""+id != "calc_kol"+id) {
		var pr = Math.round((total/kol)*100)/100;
		$("#"+form+" #calc_price"+id).val(pr);
	}
	if(upd == 1) {storeOrder(form,id,par);}
}


/*********************/


function writeoffOrder(form,id,par) {
	var comp_sel;
	if(!id) {
		comp_sel = $("#"+form+" input:checked").attr("id");
	} else {
		i = id;
		order_kol[i] = Math.round($("#"+form+" #calc_kol"+i).val()*1000)/1000;
		order_price[i] = Math.round($("#"+form+" #calc_price"+i).val()*1000)/1000;
		order_total[i] = Math.round($("#"+form+" #calc_total"+i).val()*1000)/1000;
	}
	if(comp_sel) {
		var i = 0;
		while(i < order.length && (order[i] != comp_sel || order_product[i] != par)) i++;
		if(i >= order.length) {
			order[i] = comp_sel;
			order_name[i] = $("#"+form+" input:checked").val();
			order_edi[i] = $("#"+form+" input:checked").attr("info");
			order_kol[i] = Math.round($("#"+form+" #calc_kol"+id).val()*1000)/1000;
			order_price[i] = Math.round($("#"+form+" #calc_price"+id).val()*1000)/1000;
			order_total[i] = Math.round($("#"+form+" #calc_total"+id).val()*1000)/1000;
			if(par == 1) {order_product[i] = 1;} else {order_product[i] = 0;}
		}
	}
	if(!order_kol[i]) {order_kol[i] = 0;}
	if(!order_price[i]) {order_price[i] = 0;}
	if(!order_total[i]) {order_total[i] = 0;}

	writeoffOrderShow();

	if(!id) {
		$("#"+form+" input:checked").parent().removeClass("current");
		$("#"+form+" input:checked").attr("checked","");
		$("#"+form+" #calc_kol").val("");
		$("#"+form+" #calc_price").val("");
		$("#"+form+" #calc_total").val("");
	}
}

function calcTotalWriteoff(form,id,elem,upd,par) {
	var kol = Math.round($("#"+form+" #calc_kol"+id).val()*1000);
	var price = Math.round($("#"+form+" #calc_price"+id).val()*1000);
	var total = Math.round($("#"+form+" #calc_total"+id).val()*1000);
	if(kol && price && elem+""+id != "calc_total"+id) {
		var pr = Math.round(((kol*price)/1000000)*100)/100;
		$("#"+form+" #calc_total"+id).val(pr);
	}
	if(kol && total && elem+""+id != "calc_price"+id && elem+""+id != "calc_kol"+id) {
		var pr = Math.round((total/kol)*100)/100;
		$("#"+form+" #calc_price"+id).val(pr);
	}
	if(upd == 1) {writeoffOrder(form,id,par);}
}

function writeoffOrderShow() {
	var display = "";
	var total = 0;
	var bcount = 0;
	var n = 1;
	for(i=0; i <= order.length; i++) {
		if(order[i]) {
			total += order_total[i];
			display += "<tr class='tr_store' align='left'>";
			display += "<td align='center'>"+n+"</td><td align='left'>"+order_name[i]+"</td>";
			display += "<td><input id='calc_kol"+i+"' value='"+order_kol[i]+"' onblur=\"igo_Add(this, this.value, 'calc_kol"+i+"'); calcTotalWriteoff('form_writeoff_order','"+i+"','calc_kol','1','"+order_product[i]+"');\" /><input type='hidden' id='calc_id"+i+"' value='"+order[i]+"' /><input type='hidden' id='calc_product"+i+"' value='"+order_product[i]+"'> "+order_edi[i]+"</td>";
			display += "<td><input id='calc_price"+i+"' value='"+order_price[i]+"' onblur=\"igo_Add(this, this.value, 'calc_price"+i+"'); calcTotalWriteoff('form_writeoff_order','"+i+"','calc_price','1','"+order_product[i]+"');\" /> "+currency+"</td>";
			display += "<td align='right'><input id='calc_total"+i+"' value='"+order_total[i]+"' onblur=\"igo_Add(this, this.value, 'calc_total"+i+"'); calcTotalWriteoff('form_writeoff_order','"+i+"','calc_total','1','"+order_product[i]+"');\" /> "+currency+"</td>";
			display += "<td align='center'><span id='noprint' onclick=\"writeoffClear('"+i+"');\" class='href red'>X</span></td></tr>";
			bcount = bcount+","+i;
			n++;
		}
	}
	if(bcount != 0) {
		total = Math.round(total*100)/100;
		display+="<tr class='tr_store_total'><td></td><td>Итого</td><td></td><td></td><td align='right'>"+total+" "+currency+"<input type='hidden' id='total' name='total' value="+total+"><input type='hidden' id='bcount' name='bcount' value='"+bcount+"'></td><td></td></tr>";
		$("#s_writeoff_save").show();
	} else {
		$("#s_writeoff_save").hide();
	}
	$("#content_writeoff_order").html(display);
}

function writeoffClear(i) {
	if(i) {
		delete(order[i]); delete(order_name[i]); delete(order_kol[i]); delete(order_price[i]); delete(order_edi[i]); delete(order_total[i]);
	} else {
		for(i=0; i <= order.length; i++) {
				delete(order[i]); delete(order_name[i]); delete(order_kol[i]); delete(order_kol[i]); delete(order_edi[i]); delete(order_total[i]);
		}
		delete(bcount);
	}
	writeoffOrderShow();
}

function writeoffOrderCont(id) {
	$("#content_writeoff_order").html("<tr height='70'><td colspan='5' align='center'>Загрузка...</td></tr>");
	$.post("blocks/function/s_writeoff.php","writeoff_cont="+id,
		function result(data) {
			 writeoffOrderShow();
		}, "script"
	);
}



/*********************/


var material = [];
var material_product = [];
var material_kol = [];
var material_name = [];
var material_edi = [];

function materialBasket(form,id,par) {
	var comp_sel = "";
	if(!id) {
		comp_sel = $("#"+form+" input:checked").attr("id");
	} else {
		i = id;
		material_kol[i] = Math.round($("#"+form+" #calc_kol"+id).val()*10000)/10000;
	}
	if(comp_sel) {
		var i = 0;
		while(i < material.length && (material[i] != comp_sel || material_product[i] != par)) i++;
		if(i < material.length) {
			material_kol[i] = Math.round($("#"+form+" #calc_kol"+id).val()*10000)/10000;
		} else {
			material[i] = comp_sel;
			material_name[i] = $("#"+form+" input:checked").val();
			material_edi[i] = $("#"+form+" input:checked").attr("info");
			material_kol[i] = Math.round($("#"+form+" #calc_kol"+id).val()*10000)/10000;
			if(par == 1) {material_product[i] = 1;} else {material_product[i] = 0;}
		}
	}
	materialBasketShow(par);
	if(!id) {
		$("#"+form+" input:checked").parent().removeClass("current");
		$("#"+form+" input:checked").attr("checked","");
		$("#"+form+" #calc_kol").val("");
	}
}

function materialBasketShow() {
	var display = "";
	var total = 0;
	var bcount = 0;
	var n = 1;
	if(material.length > 0) {
		display += "<tr height='25' class='tr_cat'><td></td><td><b>Сырье</b></td><td align='right'></td><td></td></tr>";
	}
	for(i=0; i <= material.length; i++) {
		if(material[i] && material_product[i] != 1) {
			display += "<tr height='25' class='tr_store'><td align='center'>"+n+"</td><td>"+material_name[i]+"</td><td align='left'><input id='calc_kol"+i+"' value='"+material_kol[i]+"' class='input' style='width:50px;' onblur=\"igo_Add(this, this.value, 'calc_kol"+i+"'); materialBasket('form_product_edit','"+i+"','"+material_product[i]+"');\" /> "+material_edi[i]+"<input type='hidden' id='component_prod"+material[i]+"' value=''><input type='hidden' id='component_kol"+material[i]+"' value='"+material_kol[i]+"'></td><td align='center'><span class='href red' style=\"cursor:pointer;\" onclick=\"materialBasketClear('"+i+"')\">X</span></td></tr>";
			bcount = bcount+","+material[i];
			n++;
		}
	}
	if(material.length > 0) {
		display += "<tr height='25' class='tr_cat'><td></td><td><b>Товары</b></td><td align='right'></td><td></td></tr>";
	}
	var n = 1;
	for(i=0; i <= material.length; i++) {
		if(material[i] && material_product[i] == 1) {
			display += "<tr height='25' class='tr_store'><td align='center'>"+n+"</td><td>"+material_name[i]+"</td><td align='left'><input id='calc_kol"+i+"' value='"+material_kol[i]+"' class='input' style='width:50px;' onblur=\"igo_Add(this, this.value, 'calc_kol"+i+"'); materialBasket('form_product_edit','"+i+"','"+material_product[i]+"');\" /> "+material_edi[i]+"<input type='hidden' id='component_prod"+material[i]+"' value='1'><input type='hidden' id='component_kol"+material[i]+"' value='"+material_kol[i]+"'></td><td align='center'><span class='href red' style=\"cursor:pointer;\" onclick=\"materialBasketClear('"+i+"')\">X</span></td></tr>";
			bcount = bcount+","+material[i];
			n++;
		}
	}

	display+="<input type='hidden' id='bcount' value='"+bcount+"'>";
	$("#productMaterial").html(display);
}

function materialBasketClear(i) {
	if(i) {
		delete(material[i]); delete(material_name[i]); delete(material_kol[i]); delete(material_edi[i]); delete(material_product[i]);
	} else {
		for(i=0; i <= material.length; i++) {
			delete(material[i]); delete(material_name[i]); delete(material_kol[i]); delete(material_edi[i]); delete(material_product[i]);
		}
		delete(bcount);
	}
	materialBasketShow();
}


/*********************/

function issueOrder(form,id) {
	if(!id) {
		comp_sel = $("#"+form+" input:checked").attr("id");
	} else {
		comp_sel = id;
	}
	if(comp_sel) {
		var i = 0;
		while(i <= order.length && order[i] != comp_sel) i++;
		if(i > order.length) {
			order[i] = comp_sel;
			order_name[i] = $("#"+form+" input:checked").val();
			order_edi[i] = $("#"+form+" input:checked").attr("info");
		}
		if(!order_kol[i]) {order_kol[i] = 0;}
		if(!id) {
			order_kol[i] = order_kol[i] + Math.round($("#"+form+" #calc_kol"+id).val()*1000)/1000;
		} else {
			order_kol[i] = Math.round($("#"+form+" #calc_kol"+id).val()*1000)/1000;
		}
		issueOrderShow();
		if(!id) {
			$("#"+form+" input:checked").parent().removeClass("current");
			$("#"+form+" input:checked").attr("checked","");
			$("#"+form+" #calc_kol").val("");
		}
	}
}

function issueOrderShow() {
	var display = "";
	var total = 0;
	var bcount = 0;
	var n = 1;
	for(i=0; i <= order.length; i++) {
		if(order[i]) {
			total += order_total[i];
			display += "<tr class='tr_store' align='left'>";
			display += "<td align='center'>"+n+"</td><td align='left'>"+order_name[i]+"</td>";
			display += "<td><input id='calc_kol"+order[i]+"' value='"+order_kol[i]+"' onblur=\"igo_Add(this, this.value, 'calc_kol"+order[i]+"'); issueOrder('form_issue_order','"+order[i]+"');\" /> "+order_edi[i]+"</td>";
			display += "<td align='center'><span id='noprint' onclick=\"issueOrderClear('"+i+"')\" class='href red'>X</span></td></tr>";
			bcount = bcount+","+order[i];
			n++;
		}
	}
	if(bcount != 0) {
		total = Math.round(total*100)/100;
		display+="<tr class='tr_store_total'><td></td><td></td><td></td><td></td><td align='right'><input type='hidden' id='bcount' name='bcount' value='"+bcount+"'></td><td></td></tr>";
		$("#s_issue_save").show();
	} else {
		$("#s_issue_save").hide();
	}
	$("#content_issue_order").html(display);
}

function issueOrderClear(i) {
	if(i) {
		delete(order[i]); delete(order_name[i]); delete(order_kol[i]); delete(order_price[i]); delete(order_edi[i]); delete(order_total[i]);
	} else {
		for(i=0; i <= order.length; i++) {
			delete(order[i]); delete(order_name[i]); delete(order_kol[i]); delete(order_kol[i]); delete(order_edi[i]); delete(order_total[i]);
		}
		delete(bcount);
	}
	issueOrderShow();
}

function issueOrderCont(id) {
	$("#content_issue_order").html("<tr height='70'><td colspan='4' align='center'>Загрузка...</td></tr>");
	$.post("blocks/function/s_issue.php","s_issue_cont="+id,
		function result(data) {
			issueOrderShow();
		}, "script"
	);
}

/**************************/

function s_revisOrder(form,id,par) {
	if(!id) {
		var comp_sel = $("#"+form+" input:checked").attr("id");
	} else {
		order_kol[id] = Math.round($("#"+form+" #calc_kol"+id).val()*1000)/1000;
	}
	if(comp_sel) {
		var i = 0;
		while(i < order.length && (order[i] != comp_sel || order_product[i] != par)) i++;
		if(i < order.length) {
			order_kol[i] = Math.round($("#"+form+" #calc_kol"+id).val()*1000)/1000;
		} else {
			order[i] = comp_sel;
			order_name[i] = $("#"+form+" input:checked").val();
			order_edi[i] = $("#"+form+" input:checked").attr("info");
			order_kol[i] = Math.round($("#"+form+" #calc_kol"+id).val()*1000)/1000;
			if(par == 1) {order_product[i] = 1;} else {order_product[i] = 0;}
		}
	}
	s_revisOrderShow(par);
	if(!id) {
		$("#"+form+" input:checked").parent().removeClass("current");
		$("#"+form+" input:checked").attr("checked","");
		$("#"+form+" #calc_kol").val("");
	}
}

function s_revisOrderShow(par) {
	var display = "";
	var bcount = 0;
	var n = 1;
	for(var i=0; i<=order.length; i++) {
		if(order[i]) {
			display += "<tr class='tr_store' align='left'>";
			display += "<td align='center'>"+n+"</td><td align='left'>"+order_name[i]+"</td>";
			display += "<td><input id='calc_kol"+i+"' value='"+order_kol[i]+"' onblur=\"igo_Add(this, this.value, 'calc_kol"+i+"'); s_revisOrder('form_s_revis_order','"+i+"','"+order_product[i]+"');\" /><input type='hidden' id='calc_id"+i+"' value='"+order[i]+"' /><input type='hidden' id='calc_product"+i+"' value='"+order_product[i]+"'> "+order_edi[i]+"</td>";
			display += "<td align='center'><span id='noprint' class='red' style=\"cursor:pointer;\" onclick=\"s_revisOrderClear('"+i+"')\">X</span></td></tr>";
			bcount = bcount+","+i;
			n++;
		}
	}
	if(bcount != 0) {
		$("#button_s_revis_order1").html("<span onclick=\"sendForm('form_s_revis_order','sklad','s_revis');\" class='btn save' id='yes'>Сохранить</span>");
	} else {
		$("#button_s_revis_order1").html("");
	}
	display+="<input type='hidden' id='bcount' name='bcount' value='"+bcount+"'>";
	$("#content_s_revis_order").html(display);
}

function s_revisOrderClear(i) {
	if(i) {
		delete(order[i]); delete(order_name[i]); delete(order_kol[i]); delete(order_price[i]); delete(order_edi[i]); delete(order_total[i]);
	} else {
		for(i=0; i <= order.length; i++) {
			delete(order[i]); delete(order_name[i]); delete(order_kol[i]); delete(order_kol[i]); delete(order_edi[i]); delete(order_total[i]);
		}
		delete(bcount);
	}
	s_revisOrderShow();
}

/**************************/

function movementOrder(form,id,par) {
	var comp_sel;
	if(!id) {
		comp_sel = $("#"+form+" input:checked").attr("id");
	} else {
		i = id;
		order_kol[i] = Math.round($("#"+form+" #calc_kol"+i).val()*1000)/1000;
	}
	if(comp_sel) {
		var i = 0;
		while(i < order.length && (order[i] != comp_sel || order_product[i] != par)) i++;
		if(!order_kol[i]) {order_kol[i] = 0;}
		if(i >= order.length) {
			order[i] = comp_sel;
			order_name[i] = $("#"+form+" input:checked").val();
			order_edi[i] = $("#"+form+" input:checked").attr("info");
			order_kol[i] = Math.round($("#"+form+" #calc_kol"+id).val()*1000)/1000;
			if(par == 1) {order_product[i] = 1;} else {order_product[i] = 0;}
		} else {
			order_kol[i] = order_kol[i] + Math.round($("#"+form+" #calc_kol"+id).val()*1000)/1000;
		}
	}

	movementShow();
	if(!id) {
		$("#"+form+" input:checked").parent().removeClass("current");
		$("#"+form+" input:checked").attr("checked","");
		$("#"+form+" #calc_kol").val("");
	}
}

function movementShow(block) {
	if(block) {block = "disabled='disabled'";}
	var display = "";
	var bcount = 0;
	var n = 1;
	for(i=0; i <= order.length; i++) {
		if(order[i]) {
			display += "<tr class='tr_store' align='left'>";
			display += "<td align='center'>"+n+"</td><td align='left'>"+order_name[i]+"</td>";
			if(order_product[i]) {
				display += "<td><input id='product_kol["+order[i]+"]' value='"+order_kol[i]+"' onblur=\"igo_Add(this, this.value, 'calc_kol["+i+"]');\" "+block+" /> "+order_edi[i]+"";
			} else {
				display += "<td><input id='component_kol["+order[i]+"]' value='"+order_kol[i]+"' onblur=\"igo_Add(this, this.value, 'calc_kol["+i+"]');\" "+block+" /> "+order_edi[i]+"";
			}
			display += "<td align='center'>";
			if(!block) {display += "<span id='noprint' onclick=\"movementOrderClear('"+i+"')\" class='href red'>X</span>";}
			display += "</td></tr>";
			bcount = bcount+","+i;
			n++;
		}
	}
	if(bcount != 0) {
		$("#s_movement_save").show();
	} else {
		$("#s_movement_save").hide();
	}
	$("#content_movement_order").html(display);
}

function movementOrderClear(i) {
	if(i) {
		delete(order[i]); delete(order_name[i]); delete(order_kol[i]); delete(order_edi[i]);
	} else {
		for(i=0; i <= order.length; i++) {delete(order[i]); delete(order_name[i]); delete(order_kol[i]); delete(order_edi[i]);}
		delete(bcount);
	}
	movementShow();
}
