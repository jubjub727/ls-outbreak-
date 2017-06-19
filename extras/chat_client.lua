local chatopened = false
local chatloaded = false
local chatactive = true
local timeout
local toload = {}

chatCanOpen = true

Chat = {}

function Chat:Opened()
	return chatopened
end

function Chat:Active(state)
	chatactive = state
end

function Chat:Hide(state)
	browser:execJS(string.format("hideChat(%s);", state and 'true' or 'false'))
end

function Chat:AddMessage(name, msg)
	browser:execJS(string.format("addMessage('%s', '%s');", name, msg))
end

local browser = UI:Browser("http://orange/resources/chat/html/index.html")

browser:on("load", function()
	print("[Chat] load complete")

	for k, v in pairs(toload) do
		if not v[1] then
			browser:execJS(string.format("addString('%s');", v[2]))
		else
			browser:execJS(string.format("addMessage('%s', '%s');", v[1], v[2]))
		end
	end

	browser:on("chat:inputmsg", function(text)
		chatopened = false
		if text:len() > 0 then
			Server:Trigger("chat:msg", text)
		end
	end)

	browser:on("chat:close", function(text)
		if timeout then timeout:stop() end
		timeout = Thread:SetTimeout(function()
			chatopened = false
		end, 50)
	end)

	chatloaded = true
end)

Server:On("KeyPress", function(key)
	if chatloaded and chatactive and not chatopened and key == Button.T and chatCanOpen then
		chatopened = true
		if timeout then
			timeout:stop()
			timeout = nil
		end
		browser:execJS("openChat();")
	end
end)

Server:On("chat:msg", function(name, text)
	if not chatloaded then
		table.insert(toload, { name, text })
	else
		if not name then
			browser:execJS(string.format("addString('%s');", text))
		else
			browser:execJS(string.format("addMessage('%s', '%s');", name, text))
		end
	end
end)

Thread:new(function()
	while true do
		if chatopened then
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