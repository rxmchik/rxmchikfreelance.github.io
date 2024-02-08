//ymaps.ready(init);
var myMap;
var sq_orders;
var sq_ordersID;
var myPolygon;
var Placemark;
var myCollection;

var city_coords;

var square = new Array();
var squareID = new Array();
var square_i = new Array();
var square_name = new Array();
var square_color = new Array();
var square_new = new Array();

function init(id,d,f,z) {
	if(city_coords) {
		myMap = new ymaps.Map(id, {
			center: city_coords,
			zoom: z,
			behaviors: ['default', 'scrollZoom']
		});

		myMap.controls
		.add('zoomControl')
		.add('typeSelector')
		.add('mapTools');

		if(d) {squareLoadOrders(d,f);}
		squareLoad();
	}
}

function squareLoadOrders(d,f) {
	$("#map_order_loader").show();
	$.post("blocks/function/square.php","square_load_orders="+d+f,
		function result(data) {
			if(data) {
				myMap.geoObjects.add(myCollection);
			}
			$("#map_order_loader").hide();
		}, "script"
	);
}


function squareLoadCouriers(lat,long,name) {
	myCollection = new ymaps.GeoObjectCollection({}, {
		draggable: false
	});
	myCollection.add(new ymaps.Placemark([lat,long],{balloonContent: name}, {preset: 'twirl#carIcon'}));
	myMap.geoObjects.add(myCollection);
}


function squareCheckOrders(d,f) {
	$("#map_order_loader").show();
	var check = "";
	if(square.length > 0) {
		if(sq_orders) {
		for(var i=0; i<square.length; i++) {
			check += "square_check["+squareID[i]+"]=";
			for (var n=0; n<sq_orders.length; n++) {
				if(square[i].geometry.contains(sq_orders[n])) {
					check += sq_ordersID[n]+",";
				}
			}
			check += "&";
		}
		if(check != "") {
			$.post("blocks/function/square.php",check+"&date="+d+f,
				function result(data) {
					if(data == 'no_shedule') {
						alert("Создайте расписание курьеров");
					} else {
						menu('map','map',f);
					}
				}
			);
		}
		} else {alert("Нет заказов для распределения");}
	} else {alert("Создайте зоны доставки");}
	$("#map_order_loader").hide();
}

function squareLoad() {
	for(var i=0; i<square.length; i++) {
		if(square[i]) {
			myMap.geoObjects.remove(square[i]);
		}
	}
	square = [];
	if(square_new.length > 0) {
		for(var i=0; i<square_new.length; i++) {
			if(square_new[i]) {
				square[i] = square_new[i];
				myMap.geoObjects.add(square_new[i]);
			}
		}
	}
}

function squareCreate(f) {
	squareEditBreak();
	var sq_color = $("#square_create_block select option:selected").val();
	var i = 0;
	while(i < square.length) i++;
	$("#square_create_block input").val("");
	$("#square_create_block #square_save").attr("onclick","squareSave('add','"+i+"','"+f+"')");
	$("#square_list").hide();
	$("#square_create_block").show();

    square[i] = new ymaps.Polygon([], {}, {
        editorDrawingCursor: "crosshair",
        editorMaxPoints: 30,
        fillColor: sq_color,
        strokeColor: '#0000FF55',
        strokeWidth: 2
    });
    myMap.geoObjects.add(square[i]);
    square[i].editor.startDrawing();
}


function squareEdit(i,f) {
	squareEditBreak();
	square[square_i[i]].editor.startEditing();
	$("#square_create_block input").val(square_name[i]);
	$('#square_create_block select option:selected').each(function(){this.selected=false;});
	$("#square_create_block select [value='"+square_color[i]+"']").attr("selected", "selected");
	$("#square_create_block #square_save").attr("onclick","squareSave('edit','"+i+"','"+f+"')");
	$("#square_list").hide();
	$("#square_create_block").show();
}

function squareEditBreak() {
	for(var i=0; i<square.length; i++) {
		square[i].editor.stopEditing()
	}
}

function squareEditStop(f) {
	squareEditBreak();
	$("#square_list").show();
	$("#square_create_block").hide();
	squareLoad();
}

function squareDel(i,f) {
	squareEditBreak();
	$.post("blocks/function/square.php","square_del="+i,
		function result(data) {
			$("#square_list").show();
			$("#square_create_block").hide();
			squareLoad();
			menu('square','square',f);
		}
	);
}

function squareSave(type,i,f) {
	var sq_name = $("#square_create_block input").val();
	var sq_color = $("#square_create_block select option:selected").val();
	if(sq_name) {
		if(type == 'add') {
			var str = "square_add=&name="+sq_name+"&color="+sq_color+"&coords="+square[i].geometry.getCoordinates();
		} else {
			var str = "square_edit="+i+"&name="+sq_name+"&color="+sq_color+"&coords="+square[square_i[i]].geometry.getCoordinates();
		}
		$.post("blocks/function/square.php",str+f,
			function result(data) {
				$("#square_create_block input").val("");
				$("#square_list").show();
				$("#square_create_block").hide();
				squareEditStop(f);
				menu('square','square',f);
			}
		);
	} else {alert("Укажите название");}
}


/***/
function sheduleWaiterSelect(day) {
	var display = "<select id='shedule_filter_waiter"+day+"' onchange=\"sheduleWaiterAdd('"+day+"');\"><option value=''>Курьер</option>";
	for(var i in source_courier) {
		if(!shedule_day[day][i]) {
			display += "<option value='"+i+"'>"+source_courier[i]+"</option>";
		} else {
			display += "<option value='"+i+"' disabled='disabled'>"+source_courier[i]+"</option>";
		}
	}
	display += "</select>";
	$("#shedule_add_waiter"+day).html(display);
}

function sheduleWaiterAdd(day) {
	shedule_day[day][$("#shedule_filter_waiter"+day+" option:selected").val()] = [];
	$("#shedule_add_waiter"+day).html("<span></span><span class='btn grey plus' onclick=\"sheduleWaiterSelect('"+day+"');\"><span></span>Добавить курьера</span>");
	sheduleShow(day);
}

function sheduleWaiterDel(day,id) {
	delete(shedule_day[day][id]);
	sheduleShow(day);
}

function sheduleSquareDel(day,id,i) {
	delete(shedule_day[day][id][i]);
	sheduleShow(day);
}

function sheduleShow(day) {
	var display = "";
	for(var i in shedule_day[day]) {
		display += "<div class='shedule_courier'>\
		<table border='0' cellpadding='0' cellspacing='0'>\
		<tr valign='top'>\
		<td class='shedule_name'><ul><li>"+source_courier[i]+" <span onclick=\"sheduleWaiterDel('"+day+"','"+i+"');\" class='icon delete'></span></li></ul></td>\
		<td class='shedule_square'>\
			<div class='shedule_square_sel' id='shedule_add_square"+day+"_"+i+"'><span></span><span class='btn grey plus' onclick=\"sheduleSquareSelect('"+day+"','"+i+"');\"><span></span>добавить зону</span></div>\
			<ul>";
			for(var n in shedule_day[day][i]) {
				display += "<li>"+source_square[n]+" <span onclick=\"sheduleSquareDel('"+day+"','"+i+"','"+n+"');\" class='icon delete'></span></li>";
			}
			display += "\
			</ul>\
		</td>\
		</tr>\
     	</table></div>";
	}
	$("#shedule_day"+day).html(display);
}

function sheduleSquareSelect(day,id) {
	var display = "<select id='shedule_filter_square"+day+"_"+id+"' onchange=\"sheduleSquareAdd('"+day+"','"+id+"');\"><option value=''>Зона</option>";
	for(var i in source_square) {
		if(!shedule_day[day][id][i]) {
			display += "<option value='"+i+"'>"+source_square[i]+"</option>";
		} else {
			display += "<option value='"+i+"' disabled='disabled'>"+source_square[i]+"</option>";
		}
	}
	display += "</select>";
	$("#shedule_add_square"+day+"_"+id).html(display);
}

function sheduleSquareAdd(day,id) {
	if(!shedule_day[day][id]) {
		shedule_day[day][id] = [];
	}
	shedule_day[day][id][$("#shedule_filter_square"+day+"_"+id+" option:selected").val()] = 1;
	$("#shedule_add_square"+day+"_"+id).html("<span></span><span class='btn grey plus' onclick=\"sheduleSquareSelect('"+day+"','"+id+"');\"><span></span>Добавить зону</span>");
	sheduleShow(day);
}

function sheduleSave(par) {
	$("#wait").show();
	var str = "";
	for(var i in shedule_day) {
		if(shedule_day[i].length > 0)
		str += "&shedule["+i+"]=";
		for(var n in shedule_day[i]) {
			str += n+"-";
			for(var m in shedule_day[i][n]) {
				str += m+",";
			}
			str += ";";
		}
	}
	str += par;
	$.post("blocks/function/shedule.php",str,
		function result(data) {
			menu('shedule','shedule',str);
		}
	);
}
