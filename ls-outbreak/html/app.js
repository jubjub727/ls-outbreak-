var main_theme = undefined;

$(function() {
	$("#login_menu").show("bounce", 850);
	
	$("#login_form").submit(function(event) {onLoginFormSubmit(event)});
	$("#register_form").submit(function(event) {onRegisterFormSubmit(event)});
	
	inputs = document.getElementsByTagName("input");
	for (i=0; i < inputs.length; i++) {
		inputs[i].oninput = onInputChange
		 if (inputs[i].type == "submit") {inputs[i].disabled = true;}
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

function onInputChange(elem) {
	inputs = $("input[type=password], input[type=text]");
	for (i=0; i < inputs.length; i++) {
		if (inputs[i].value == "") {
			inputs[i].parentElement.parentElement.lastElementChild.firstChild.disabled = true;
			return
		}
		inputs[i].parentElement.parentElement.lastElementChild.firstChild.disabled = false;
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
