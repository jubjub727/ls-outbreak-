local itemdata = -1
Server:On("receiveItem", function(ply, item)
	itemdata = item
end )

local function GetItem(index)
	Server:Trigger("requestItem", index)

	while (itemdata == -1) do
		Thread:Wait()
	end

	local item = itemdata
	itemdata = -1

	return item
end

local items = -1
Server:On("receiveNearItems", function(ply, itemList)
	items = itemList
end )

local function GetNearItems(x, y, z)
	Server:Trigger("requestNearItems", x, y, z)

	while (itemdata == -1) do
		Thread:Wait()
	end

	local itemList = items
	items = -1

	return itemList
end

local DropItem(index)
	Server:Trigger("dropItem", index)
end

local PickUpItem(index)
	local item = GetItem(index)
	Server:Trigger("pickUpItem", item.name, item.desc, item.model, item.type)
end

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

Server:On("inventory:addinventoryitem", function(slot, item_index, helper_text, typea, amount, plusdata, image_src)
	addItemInventory(slot, item_index, helper_text, type, amount, plusdata, image_src)
end)

Server:On("inventory:addnearbyitem", function(slot, item_index, helper_text, type, amount, plusdata, image_src)
	addItemNearby(slot, item_index, helper_text, type, amount, plusdata, image_src)
end)

browser:on("inventory:close_inv", function()
	closeInv()
end)

browser:on("inventory:itemdropped", function()
	Server:Trigger("inventory:itemdropped")
end)
browser:on("inventory:itempickedup", function()
	Server:Trigger("inventory:itempickedup")
end)

function addItemInventory(slot, item_index, helper_text, type, amount, plusdata, image_src)
	browser:execJS(string.format('addItemInventory(%s, %s, "%s", "%s", %s, "%s", "%s");', slot, item_index, helper_text, type, amount, plusdata, image_src))
end

function addItemNearby(slot, item_index, helper_text, type, amount, plusdata, image_src)
	browser:execJS(string.format('addItemNearby(%s, %s, "%s", "%s", %s, "%s");', slot, item_index, helper_text, type, amount, plusdata, image_src))
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
