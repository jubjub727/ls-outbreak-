----------------------------------
--LOGIN BY JUBJUB and VAFFANCULO--
----------------------------------

local browser = UI:Browser("http://orange/resources/ls-outbreak/html/index.html")
menu_loaded = false
local loggingIn = true
inv_active = false
local inv_loaded = false

browser:on("load", function()
	print("[Login] load complete")
	chatCanOpen = false
	menu_loaded = true
	UI:ShowCursor(true)
	
	print("[Inventory] load complete")
	inv_loaded = true
	browser:execJS("closeInv();")
	addItemInventory(6,"%amount of %name",  "Vehicle Key", 1, "apple")
	addItemNearby(7,"%amount of %name",  "Vehicle Key", 5, "apple")
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
		if loggingIn or inv_active then
			Native.SetPauseMenuActive(false);

			if Native.GetLastInputMethod(2) then
				Native.DisableControlAction(0, 0, false);
			
				for i = 1, 337 do
					Native.DisableControlAction(0, i, false);
				end
			end
		end
		Thread:Wait()
	end
end)

---------------------------
--INVENTORY BY VAFFANCULO--
---------------------------

Server:On("KeyPress", function(key)
	if inv_loaded and key == 73 then
		if not loggingIn then
			if inv_active then
				closeInv()
			else
				showInv()
			end
		end
	end
end)

browser:on("inventory:close_inv", function()
	closeInv()
end)
browser:on("inventory:showStackUI", function()
	showStackUI()
end)
browser:on("inventory:closeStackUI", function()
	showStackUI()
end)

function addItemInventory(slot, helper_text, type, amount, plusdata)
	browser:execJS(string.format('addItemInventory(%s, "%s", "%s", %s, "%s");', slot, helper_text, type, amount, plusdata))
end

function addItemNearby(slot, helper_text, type, amount, plusdata)
	browser:execJS(string.format('addItemNearby(%s, "%s", "%s", %s, "%s");', slot, helper_text, type, amount, plusdata))
end

function closeInv()
	inv_active = false
	browser:execJS("closeInv();")
	UI:ShowCursor(false)
end

function showInv()
	inv_active = true
	browser:execJS("openInv();")
	UI:ShowCursor(true)
end
