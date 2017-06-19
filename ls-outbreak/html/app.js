var main_theme = undefined;

$(function() {
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
});

function onLoginFormSubmit(event) {
	event.preventDefault();
	TriggerEvent("login", event.target[0].value, event.target[1].value);
}

function onRegisterFormSubmit(event) {
	event.preventDefault();
	TriggerEvent("register", event.target[1], event.target[2], event.target[0]);
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
