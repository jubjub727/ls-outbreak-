----------------------------------
--LOGIN BY JUBJUB and VAFFANCULO--
----------------------------------

local browser = UI:Browser("http://orange/resources/ls-outbreak/html/index.html")
menu_loaded = false
local loggingIn = true
inv_loaded = false

browser:on("load", function()
  print("[Login] load complete")
	chatCanOpen = false
	menu_loaded = true
	UI:ShowCursor(true)

	print("[Inventory] load complete")
	inv_loaded = true
end)

local inv_active = -1;
function invActive()
	browser:execJS("requestInvActive();")
	while (inv_active == -1) do
		Thread:Wait()
	end

	local active = inv_active
	inv_active = -1
	return active
end

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
	browser:execJS("toggleIcons();")
	UI:ShowCursor(false)
	loggingIn = false
	chatCanOpen = true
end)

Thread:new(function()
	while true do
		if loggingIn or invActive() then
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

--------------------------------------
--SHOP BY JUBJUB and VAFFANCULO--
--------------------------------------
Server:On("addSectionToSectionArray", function(title)
browser:execJS(string.format("addSectionToSectionArray('%s')", title))
end)

Server:On("addItemToSectionArray", function(section_id, image_src, title, price, description)
browser:execJS(string.format("addItemToSectionArray('%s','%s','%s',%s,'%s')", section_id, image_src, title, price, description))
end)

local shop_active = -1;
function shopActive()
	browser:execJS("requestShopActive();")
	while (shop_active == -1) do
		Thread:Wait()
	end

	local active = shop_active
	shop_active = -1

	return active
end

local function addItemsToSection()
  browser:execJS("addItemsToSection();")
end

--------------------------------------
--INVENTORY BY JUBJUB and VAFFANCULO--
--------------------------------------

local itemdata = -1
--Server:On("receiveItem", function(item)
--	itemdata = item
Server:On("receiveItem", function(name, desc, model, type, extra)
	local newItem = {}
	newItem.name = name
	newItem.desc = desc
	newItem.model = model
	newItem.type = type
	newItem.extra = extra
	itemdata = newItem
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
Server:On("receiveNearItems", function(itemList)
	items = itemList
end )

browser:on("receiveInvActive", function(inv_active)
	inv_active = inv_active
end )

browser:on("showMouse", function()
	UI:ShowCursor(true)
end)

browser:on("hideMouse", function()
	UI:ShowCursor(false)
end)

local function GetNearItems(x, y, z)
	Server:Trigger("requestNearItems", x, y, z)

	while (items == -1) do
		Thread:Wait()
	end

	local itemList = items
	items = -1

	return itemList
end

local function DropItem(name, model, type)
	Server:Trigger("dropItem", name, model, type)
end

local function PickUpItem(index)
	Server:Trigger("pickUpItem", index)
end

function toggleShop()
	browser:execJS("toggleShop();")
end

Server:On("KeyPress", function(key)
	if inv_loaded and key == 73 then
		if not loggingIn then
			toggleInv()
		end

	elseif inv_loaded and key == 66 then
		if not loggingIn then
			toggleShop()
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
	toggleInv()
end)

browser:on("inventory:itemdropped", function(name, model, type)
	DropItem(name, model, type)
end)
browser:on("inventory:itempickedup", function(index)
	PickUpItem(index)
end)

function addItemInventory(slot, item_index, helper_text, name, amount, plusdata, model, type)
	browser:execJS(string.format('addItemInventory(%s, %s, "%s", "%s", %s, "%s", "%s", "%s");', slot, item_index, helper_text, name, amount, plusdata, model, type))
end

function addToNearbyArray(slot, item_index, helper_text, name, amount, plusdata, model, type)
	browser:execJS(string.format('addToNearbyArray(%s, %s, "%s", "%s", %s, "%s", "%s", "%s");', slot, item_index, helper_text, name, amount, plusdata, model, type))
end

function toggleInv()
	browser:execJS("toggleInv();")
end

Thread:new(function()
	while true do
    print("a")
    if inv_loaded and invActive() then
			local player = Native.PlayerPedId()
			local items = GetNearItems(x,y,z)
      --local shop_items = GetNearShopItems(x,y,z)
			browser:execJS("clearNearbyList();")
			for k,v in pairs(items) do
				local item = GetItem(v)
				addToNearbyArray(v-1, v, "__amount of __name", item.name, 1, item.extra, item.model, item.type)
			end
			browser:execJS("addNearbyItems()");
		end
    if menu_loaded and shopActive() then
      local x,y,z = Native.GetEntityCoords(player, 0)
      local shop_items = GetShopItems(x,y,z)
      --local shop_sections = GetShopSections(x,y,z)
      shop_sections = {"Section Title 1", "Section Title 2"}
      for k,v in pairs(shop_sections) do
        addSectionToSectionArray(v)
        --add items
        --Parameters: section_id, image_src, title, price, description
        addItemToSectionArray(k-1, "http://www.st2299.com/data/wallpapers/230/wp-image-59152519.png", "Title 1", "1000", "This is cool")
        addItemToSectionArray(k-1, "http://www.st2299.com/data/wallpapers/230/wp-image-59152519.png", "Title 2", "2500", "This is cool")
        --Update everything
        addItemsToSection()
      end
    end
	Thread:Wait(500)
  end
end)
