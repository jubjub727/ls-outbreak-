local browser = UI:Browser("http://orange/resources/ls-outbreak/html/index.html")
menu_loaded = false
local loggingIn = true

browser:on("load", function()
	print("[Login] load complete")
	chatCanOpen = false
	menu_loaded = true
	UI:ShowCursor(true)
end)

browser:on("login", function(username, password)
	local pass = sha(password)

	Server:Trigger("login:login", username, pass)
end)

browser:on("register", function(username, password, email)
	local pass = sha(password)
	
	Server:Trigger("login:register", username, pass, email)
end)

Server:On("closemenus", function()
	browser:execJS("closeMenus();")
	browser:execJS("stopMusic();")
	UI:ShowCursor(false)
	loggingIn = false
	chatCanOpen = true
end)

Thread:new(function()
	while true do
		if loggingIn then
			Native.SetPauseMenuActive(false);

			if Native.GetLastInputMethod(2) then
				Native.DisableControlAction(0, 0, false);
			
				for i = 7, 337 do
					Native.DisableControlAction(0, i, false);
				end
			end
		end
		Thread:Wait()
	end
end)