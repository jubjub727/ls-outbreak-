  /*-------------------------------- */
 /* LOGIN SYSTEM BY: VAFFANCULO and JUBJUB */
/*-------------------------------- */

var main_theme = undefined;


$(function() {
	/* LOGIN BELOW*/
	$("#login_menu").show("bounce", 850);
	
	$("#login_form").submit(function(event) {onLoginFormSubmit(event)});
	$("#register_form").submit(function(event) {onRegisterFormSubmit(event)});
	
	login_inputs = document.getElementById("login_form").getElementsByTagName("input");
	register_inputs = document.getElementById("register_form").getElementsByTagName("input");
	for (i=0; i < login_inputs.length; i++) {
		login_inputs[i].oninput = onLoginInputChange
		 if (login_inputs[i].type == "submit") {login_inputs[i].disabled = true;}
	}
	for (i=0; i < register_inputs.length; i++) {
		register_inputs[i].oninput = onRegisterInputChange
		 if (register_inputs[i].type == "submit") {register_inputs[i].disabled = true;}
	}
	
	main_theme = new Audio("sounds/main.ogg");
	
	main_theme.volume = 0.06;
	main_theme.loop = true;
	main_theme.play();
	
	$(".speaker").click(function() {
		$(".speaker").toggle();
		if (main_theme.paused) {
			main_theme.play();
		}
		else {
			main_theme.pause();
		}
	});
	
	/* INVENTORY BELOW*/
	$("#inventory_menu").draggable({handle: ".top_border"});
	
	for (i = 0; i < 12; i++) { 
		$("#firstgrid").append("<div class='menu_slot nearby_slot' ></div>");
	}
	
	for (i = 0; i < 24; i++) { 
		$("#secondgrid").append("<div class='menu_slot inventory_slot' ></div>");
	}
	
	$(".menu_slot").droppable({
		accept: ".item_img", 
		hoverClass: "drop_hover", 
		drop: handleDrop
		});
});

function onLoginFormSubmit(event) {
	event.preventDefault();
	TriggerEvent("login", event.target[0].value, event.target[1].value);
}

function onRegisterFormSubmit(event) {
	event.preventDefault();
	TriggerEvent("register", event.target[1].value, event.target[2].value, event.target[0].value);
}

function onLoginInputChange(elem) {
	login_inputs = $("#login_form input");
	for (i=0; i < login_inputs.length; i++) {
		if (login_inputs[i].value == "") {
			login_inputs[i].parentElement.parentElement.lastElementChild.firstChild.disabled = true;
			return
		}
		login_inputs[i].parentElement.parentElement.lastElementChild.firstChild.disabled = false;
	}
}

function onRegisterInputChange(elem) {
	register_inputs = $("#register_form input");
	for (i=0; i < register_inputs.length; i++) {
		if (register_inputs[i].value == "") {
			register_inputs[i].parentElement.parentElement.lastElementChild.firstChild.disabled = true;
			return
		}
		register_inputs[i].parentElement.parentElement.lastElementChild.firstChild.disabled = false;
	}
}

function showRegisterMenu() {
	$("#login_menu").hide();
	$("#register_menu").show("fold", 500);
}
function showLoginMenu() {
	$("#register_menu").hide();
	$("#login_menu").show("fold", 500);
}

function closeMenus() {
	$("#login_menu").hide();
	$("#register_menu").hide();
}
function stopMusic() {
	main_theme.pause();
	main_theme = undefined;
}

  /*-------------------------------- */
 /* INVENTORY SYSTEM BY: VAFFANCULO */
/*-------------------------------- */


var ctrlPressed;

document.onkeydown = function(e) {
	if (e.keyCode === 17) {
        ctrlPressed = true;
    }
	
}
document.onkeyup = function(e) {
	if (e.keyCode === 17) {
        ctrlPressed = false;
    }
	
}

function handleDrop(event, ui) {
	if (ctrlPressed != true) {
		if (event.target.children.length != 0) {
			if (event.target.firstChild.itemname == ui.draggable[0].parentElement.itemname || event.target.firstChild.plusdata == ui.draggable[0].parentElement.plusdata) {
				ui.draggable[0].parentElement.itemcount = ui.draggable[0].parentElement.itemcount + event.target.firstChild.itemcount;
				ui.draggable[0].parentElement.children[1].innerHTML = ui.draggable[0].parentElement.itemcount + "x";
			}
			else {
				$(ui.draggable[0].from).append(event.target.firstChild);
			}
			event.target.innerHTML = "";
		}
		$(event.target).append(ui.draggable[0].parentElement);
			
		$("body").remove("ui-helper-hidden-accessible");
		$(".menu_slot").tooltip();
	}
	else {
		if (event.target.children.length != 0) {
			if (event.target.firstChild.itemname == ui.draggable[0].parentElement.itemname || event.target.firstChild.plusdata == ui.draggable[0].parentElement.plusdata) {
				ui.draggable[0].parentElement.itemcount = Math.floor(ui.draggable[0].parentElement.itemcount / 2) + event.target.firstChild.itemcount;
				ui.draggable[0].parentElement.children[1].innerHTML = ui.draggable[0].parentElement.itemcount + "x";
			}
			else {
				$(ui.draggable[0].from).append(event.target.firstChild);
			}
		}
		else {
			ui.draggable[0].parentElement.itemcount = Math.floor(ui.draggable[0].parentElement.itemcount / 2)
			ui.draggable[0].parentElement.children[1].innerHTML = ui.draggable[0].parentElement.itemcount + "x";
			$(event.target).append($(ui.draggable[0].parentElement).clone());
			event.target.firstChild.firstChild.style.top = ""
			event.target.firstChild.firstChild.style.left = ""
			event.target.firstChild.firstChild.title = ui.draggable[0].title
			event.target.firstChild.itemcount = ui.draggable[0].parentElement.itemcount
			console.log(event.target.firstChild)
			$(event.target.firstChild.firstChild).draggable( {
				revert:"invalid",
				stop: function(event, ui) {event.target.style = "";},
				start: function(event, ui) {this.from = this.parentElement.parentElement;}
			});
			
			
			
			
		}
		$("body").remove("ui-helper-hidden-accessible");
		$(".menu_slot").tooltip();
	}
	
};

function getEmptySlots() {
	return $(".menu_slot:not(:has(*))");
};

function openInv() {
	$("#inventory_menu").show();
};


function closeInv() {
	$("#inventory_menu").hide();
};

function addItemInventory(slot, helper_text, itemname, itemcount, plusdata) {
	if (slot > 24 || slot < 0) {
		return
	}
	
	$(".inventory_slot")[slot].innerHTML = "<div class='menu_item'><img src='http://orange/server/resources/ls-outbreak/html/img/car_key.png' title='%ItemName' class='item_img'></img> <div class='item_count'>%ItemCount</div> </div>".replace("%ItemName", helper_text.replace("%amount", itemcount).replace("%name", itemname).replace("%plusdata", plusdata)).replace("%ItemCount", itemcount + "x");
	$($(".inventory_slot")[slot]).tooltip();
	$(".inventory_slot")[slot].children[0].data = plusdata;
	$(".inventory_slot")[slot].children[0].itemcount = itemcount;
	$(".inventory_slot")[slot].children[0].itemname = itemname;
	$(".item_img").draggable( {
	revert:"invalid",
	stop: function(event, ui) {event.target.style = "";},
	start: function(event, ui) {this.from = this.parentElement.parentElement;}
	});
};

function addItemNearby(slot, helper_text, itemname, itemcount, plusdata) {
	if (slot > 12 || slot < 0) {
		return
	}
	
	$(".nearby_slot")[slot].innerHTML = "<div class='menu_item'><img src='http://orange/server/resources/ls-outbreak/html/img/car_key.png' title='%ItemName' class='item_img'></img> <div class='item_count'>%ItemCount</div> </div>".replace("%ItemName", helper_text.replace("%amount", itemcount).replace("%name", itemname).replace("%plusdata", plusdata)).replace("%ItemCount", itemcount + "x");
	$($(".nearby_slot")[slot]).tooltip();
	$(".nearby_slot")[slot].children[0].data = plusdata;
	$(".nearby_slot")[slot].children[0].itemcount = itemcount;
	$(".nearby_slot")[slot].children[0].itemname = itemname;
	$(".item_img").draggable( {
	revert:"invalid",
	stop: function(event, ui) {event.target.style = "";},
	start: function(event, ui) {this.from = this.parentElement.parentElement;}
	});
};


function close_inv_pressed() {
	TriggerEvent('inventory:close_inv');
};

function getFirstEmptyInventorySlotIndex() {
	slots = document.getElementsByClassName("inventory_slot");
	for (i = 0; i < slots.length; i++) {
		if (slots[i].firstChild == undefined) {
			return i
		}
	}
};

function getFirstEmptyNearbySlotIndex() {
	slots = document.getElementsByClassName("nearby_slot");
	for (i = 0; i < slots.length; i++) {
		if (slots[i].firstChild == undefined) {
			return i
		}
	}
};