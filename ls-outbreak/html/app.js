  /*-------------------------------- */
 /* LOGIN SYSTEM BY: VAFFANCULO and JUBJUB */
/*-------------------------------- */

var main_theme = undefined;
var open_things = {"inventory": false, "shop": false};
var openable_things = ["inventory", "shop"]

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
	
	/* MONEY, SHOP BELOW */
	$("#shop_menu").draggable({handle: ".top_border"});
	section_buttons = $(".header_button");
	for (i = 0; i < section_buttons.length; i++) {
		section_buttons[i].showing = true;
		toggle_section(section_buttons[i]);
	};
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

function areSame(first_element, second_element) {
	return $(first_element).is($(second_element));
};

function isSlotNearby(slot) {
	return $(slot).hasClass("nearby_slot");
};

function handleDrop(event, ui) {
	if ($(event.target).hasClass(".nearby_slot") && $(ui.draggable[0].parentElement).hasClass(".nearby_slot")) {event.preventDefault(); return;}
	
	/* CTRL WAS NOT PRESSED */
	if (ctrlPressed != true) {
		/* There was an item in that slot */
		if (event.target.children.length != 0) {
			if (areSame(event.target.firstChild, ui.draggable[0].parentElement)) {return} // If the two elements are the same, then don't do anything.
			if (event.target.firstChild.itemname == ui.draggable[0].parentElement.itemname || event.target.firstChild.plusdata == ui.draggable[0].parentElement.plusdata) {
				ui.draggable[0].parentElement.itemcount = ui.draggable[0].parentElement.itemcount + event.target.firstChild.itemcount;
				ui.draggable[0].parentElement.children[1].innerHTML = ui.draggable[0].parentElement.itemcount + "x";
			}
			else {
				$(ui.draggable[0].from).append(event.target.firstChild);
			}
			event.target.innerHTML = "";
		}
		var wasNearby = isSlotNearby(ui.draggable[0].parentElement.parentElement);
		/* There was no item in that slot*/
		$(event.target).append(ui.draggable[0].parentElement);
		if (isSlotNearby(event.target) && wasNearby != isSlotNearby(event.target)) {
			TriggerEvent("inventory:itemdropped", ui.draggable[0].parentElement.itemname, ui.draggable[0].parentElement.model, ui.draggable[0].parentElement.type)
		}
		else if  (!isSlotNearby(event.target) && wasNearby != isSlotNearby(event.target)) {
			TriggerEvent("inventory:itempickedup", ui.draggable[0].parentElement.item_index)
		}
			
		updateHelperText(event.target.firstChild) // Update helper text for the moved item
	}
	/* CTRL WAS PRESSED */
	else {
		event.preventDefault()
		/* There was no item in that slot*/
		if (event.target.children.length == 0) {
			
			/* Total number of items in the starting item*/
			var starting_item = ui.draggable[0].parentElement;
			var was_starting_slot_nearby = isSlotNearby(starting_item.parentElement); 
			var total = starting_item.itemcount;
			var ending_slot = event.target;
			/* Starting item */
			starting_item.itemcount = Math.ceil(starting_item.itemcount / 2); // Half the starting item's itemcount
			starting_item.children[1].innerHTML = starting_item.itemcount + "x"; // Display the new itemcount
			total = total - starting_item.itemcount; // total = remainder
			updateHelperText(starting_item); // Update starting item's helper_text
			
			/* Ending item */
			$(ending_slot).append($(starting_item).clone()); //Clone so the original won't disappear
			if (total <= 0) {deleteItem(starting_item)} // If the total is less or equal to 0 then delete the starting_item
			var ending_item = ending_slot.firstChild;
			var ending_img = ending_item.firstChild;
			ending_item.helper_text = starting_item.helper_text;
			
			if (total <= 0) {ending_item.itemcount = 1} // If the remainder is 0 (the starting item's itemcount was 1) then add +1 to the ending item's itemcount
			else {ending_item.itemcount = total} // Else the ending item's itemcount becomes the remainder
			ending_item.children[1].innerHTML = ending_item.itemcount + "x"; // Display new itemcount
			
			/* Reset position of the ending item/image */
			ending_img.style.top = 0; // Reset top
			ending_img.style.left = 0; // Reset left
			
			updateHelperText(ending_item); // Update ending item's helper_text
			
			/* Check if moved from inv to nearby or from nearby to inv*/
			if (isSlotNearby(ending_item.parentElement) && !was_starting_slot_nearby) {
				TriggerEvent("inventory:itemdropped", ui.draggable[0].parentElement.itemname, ui.draggable[0].parentElement.model, ui.draggable[0].parentElement.type)
			}
			else if (!isSlotNearby(ending_item.parentElement) && was_starting_slot_nearby) {
				TriggerEvent("inventory:itempickedup", ui.draggable[0].parentElement.item_index)
			}
			
			
		}
		/* There is an item in that slot*/
		else {
			if (areSame(event.target.firstChild, ui.draggable[0].parentElement)) {return} // If the two elements are the same, then don't do anything.
			
			var starting_item = ui.draggable[0].parentElement; // The item the user started dragging
			var was_starting_slot_nearby = isSlotNearby(starting_item.parentElement);
			var ending_item = event.target.firstChild; // The dropped item
			
			var total = starting_item.itemcount; // Total number of items
			starting_item.itemcount = Math.ceil(starting_item.itemcount / 2);
			starting_item.children[1].innerHTML = starting_item.itemcount + "x"; // Display the new itemcount
			updateHelperText(starting_item); // Update starting item's helper text
			total -= starting_item.itemcount; // The remainder
			
			if (total <= 0) {deleteItem(starting_item)} // If the total is less or equal to 0 then delete the starting_item
			
			/* Add the remainder to the second item*/
			if (total <= 0) {ending_item.itemcount += 1} // If the remainder is 0 (the starting item's itemcount was 1) then add +1 to the ending item's itemcount
			else {ending_item.itemcount += total} // Else add the remainder to the ending_item's itemcount
			ending_item.children[1].innerHTML = ending_item.itemcount + "x"; // Display the new itemcount for the second item
			
			ending_item.helper_text = starting_item.helper_text;
			updateHelperText(ending_item); // Update ending item's helper text
			
			if (isSlotNearby(ending_item.parentElement) && !was_starting_slot_nearby) {
				TriggerEvent("inventory:itemdropped", ui.draggable[0].parentElement.itemname, ui.draggable[0].parentElement.model, ui.draggable[0].parentElement.type)
			}
			else if (!isSlotNearby(ending_item.parentElement) && was_starting_slot_nearby) {
				TriggerEvent("inventory:itempickedup", ui.draggable[0].parentElement.item_index)
			}
			
		}
		/* Update tooltips*/
		$("body").remove("ui-helper-hidden-accessible"); // Remove all existing tooltips
		$(".menu_slot").tooltip(); // Add tooltip to every slot
		
		updateDraggables(); // Update draggables
	}
	
};

function getEmptySlots() {
	return $(".menu_slot:not(:has(*))");
};

function toggleInv() {
	$("#inventory_menu").toggle();
	open_things["inventory"] = !open_things["inventory"];
	updateMouse();
};

function deleteItem(item) {
	$(item).remove();
};

function requestInvActive() {
	TriggerEvent("receiveInvActive", open_things["inventory"])
}

function updateHelperText(item) {
	$(item)[0].children[0].title = item.helper_text.replace("%amount", item.itemcount).replace("%name", item.itemname).replace("%plusdata", item.data).replace("%ItemCount", item.itemcount + "x");
	$(".ui-helper-hidden-accessible").remove(); // Remove all tooltip helpers
	$(".ui-tooltip").remove(); // Remove active tooltips
	$(".menu_slot").tooltip(); // Reactivate tooltips
	
	
};

function  getImageSourceFromModel(model) {
	model_img_array = {"w_ar_assaultrifle": "http://orange/server/resources/ls-outbreak/html/img/ass_rifle.png"}
	return model_img_array[model]
}

function addItemInventory(slot, item_index, helper_text, itemname, itemcount, plusdata, model, type) {
	if (slot > 24 || slot < 0) {
		if (slot == -1) {
			slot = getFirstEmptyNearbySlotIndex();
		}
		else {
			return
		}
	}
	
	var image_src = getImageSourceFromModel(model);
	$(".inventory_slot")[slot].innerHTML = "<div class='menu_item'><img src='%image_src' title='%ItemName' class='item_img'></img> <div class='item_count'>%ItemCount</div> </div>".replace("%ItemName", helper_text.replace("__amount", itemcount).replace("__name", itemname).replace("%plusdata", plusdata)).replace("%ItemCount", itemcount + "x").replace("%image_src", image_src);
	$($(".inventory_slot")[slot]).tooltip();
	$(".inventory_slot")[slot].children[0].data = plusdata;
	$(".inventory_slot")[slot].children[0].itemcount = itemcount;
	$(".inventory_slot")[slot].children[0].itemname = itemname;
	$(".inventory_slot")[slot].children[0].helper_text = helper_text;
	$(".inventory_slot")[slot].children[0].item_index = item_index;
	$(".inventory_slot")[slot].children[0].type = type;
	$(".inventory_slot")[slot].children[0].model = model;
	updateDraggables();
};

function updateDraggables() {
	$(".item_img").draggable( {
	revert:"invalid",
	stop: function(event, ui) {event.target.style = "";},
	start: function(event, ui) {this.from = this.parentElement.parentElement;}
	});
};

function checkNearbySlotBeforeAdding(slot_i, item_index, helper_text, itemname, itemcount, plusdata, model, type) {
	if (slot_i == -1) {slot_i = getFirstEmptyNearbySlotIndex()}
	nearby_slots = $(".nearby_slot")
	slot = nearby_slots[slot_i];
	/* There is an item there */
	if (slot.firstChild != null) {
		item = slot.firstChild;
		/* The slot already has the same item, so don't do anything*/
		if (item.item_index == item_index && item.helper_text == helper_text && item.itemname == itemname && item.itemcount == itemcount && item.data == plusdata && item.type == type) {
			return true
		}
		else {
			return false
		}
	}
	/* There isn't an item there */
	else {
		return false
	}
}

function addItemNearby(slot, item_index, helper_text, itemname, itemcount, plusdata, model, type) {
	 if (checkNearbySlotBeforeAdding(slot, item_index, helper_text, itemname, itemcount, plusdata, model, type)) {
		 return
	 };
	if (slot > 12 || slot < 0) {
		if (slot == -1) {
			slot = getFirstEmptyNearbySlotIndex();
		}
		else {
			return
		}
	}
	var image_src = getImageSourceFromModel(model);
	$(".nearby_slot")[slot].innerHTML = "<div class='menu_item'><img src='%image_src' title='%ItemName' class='item_img'></img> <div class='item_count'>%ItemCount</div> </div>".replace("%ItemName", helper_text.replace("__amount", itemcount).replace("__name", itemname).replace("%plusdata", plusdata)).replace("%ItemCount", itemcount + "x").replace("%image_src", image_src);
	$($(".nearby_slot")[slot]).tooltip();
	$(".nearby_slot")[slot].children[0].data = plusdata;
	$(".nearby_slot")[slot].children[0].itemcount = itemcount;
	$(".nearby_slot")[slot].children[0].itemname = itemname;
	$(".nearby_slot")[slot].children[0].helper_text = helper_text;
	$(".nearby_slot")[slot].children[0].item_index = item_index;
	$(".nearby_slot")[slot].children[0].type = type;
	$(".nearby_slot")[slot].children[0].model = model;
	$(".item_img").draggable( {
	revert:"invalid",
	stop: function(event, ui) {event.target.style = "";},
	start: function(event, ui) {this.from = this.parentElement.parentElement;}
	});
};

function clearNearbySlots() {
	var slots = $(".menu_item");
	for (i = 0; i < slots.length; i++) {
		/* If its a nearby item, delete it*/
		if ($(slots[i].parentElement).hasClass("nearby_slot")) {
			$(slots[i]).remove();
		}
	}
};

var last_nearby_array = [];
var nearby_array = [];
function clearNearbyList() {
	last_nearby_array = nearby_array;
	nearby_array = [];
}

function addToNearbyArray(slot, item_index, helper_text, itemname, itemcount, plusdata, model, type) {
	var obj = {};
	obj["slot"] = slot;
	obj["item_index"] = item_index;
	obj["helper_text"] = helper_text;
	obj["itemname"] = itemname;
	obj["itemcount"] = itemcount;
	obj["plusdata"] = plusdata;
	obj["model"] = model;
	obj["type"] = type;
	nearby_array.push(obj);
};

function addNearbyItems() {
	if (_addNearbyItems()) {
		clearNearbySlots();
		for (i = 0; i < nearby_array.length; i++) {
			var item = nearby_array[i];
			addItemNearby(item["slot"], item["item_index"], item["helper_text"], item["itemname"], item["itemcount"], item["plusdata"], item["model"], item["type"]);
		}
	}
};

function _addNearbyItems() {
	var params = ["slot", "item_index", "helper_text", "itemname", "itemcount", "plusdata", "model", "type"];
	if (last_nearby_array.length != nearby_array.length) {return true}
	for (i = 0; i < nearby_array.length; i++) {
		for (i2 = 0; i2 < params.length; i2++) {
			if (nearby_array[i][params[i2]] != last_nearby_array[i][params[i2]]) {
				return true
			}
		}
	}
	return false
}

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


  /*-------------------------------- */
 /* SHOP, MONEY SYSTEM BY: VAFFANCULO */
/*-------------------------------- */

var sections = [];

function toggle_section(btn) {
	section = btn.parentElement.parentElement.children[1];
	/* The element is visible */
	if (btn.showing == true) {
		$(section).slideUp(); // Hide it with a slide motion.
		btn.innerHTML = "+";
	}
	else {
		$(section).slideDown(); // Show it with a slide motion.
		btn.innerHTML = "-";
	}
	
	btn.showing = !btn.showing;
};

function toggleShop() {
	$("#shop_menu").toggle();
	open_things["shop"] = !open_things["shop"];
	updateMouse()
}

function updateMouse() {
	for (i=0; i < openable_things.length; i++) {
		if (open_things[openable_things[i]] == true) {
			TriggerEvent("showMouse")
			return
		}
		else {
			TriggerEvent("hideMouse")
		}
	}
}

function getSectionById(id) {
	return $(".section_%id".replace("%id", id))[0]
}

function addSectionToShop(title) {
	$("#menu_main").append('<div class="shop_section section_%id"><div class="section_header"><div class="header_button" onclick="toggle_section(this);">+</div><div class="header_title">%title</div><div class="header_line"></div></div><div class="section_main"></div>'.replace("%title", title).replace("%id", sections.length));
	sections.push(getSectionById(sections.length));
}

function addItemToSection(section_id, image_src, title, price, description) {
	section = getSectionById(section_id);
	/* There is a section with that id */
	if (section != undefined){
		$(section.children[1]).append('<div class="shop_item"><div class="item_img_wrapper"><img src="%image_src" class="item_img"></img></div><div class="item_details"><div class="item_header"><span>%title</span></div><div class="item_price">%item_price</div></div></div>'.replace("%image_src", image_src).replace("%title", title).replace("%item_price", price).replace("%description", description))
		$(section.children[1]).hide();
	}
	/* There isn't a section with that id*/
	else {
		return
	}
}

  /*-------------------------------- */
 /* ICON BY: VAFFANCULO */
/*-------------------------------- */

function toggleIcons() {
	$("#helper_icons").toggle();
};