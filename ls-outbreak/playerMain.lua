local browser = UI:Browser("http://orange/resources/login/html/index.html")
menu_loaded = false

browser:on("load", function()
	print("[Login] load complete")
	menu_loaded = true
	UI:ShowCursor(true)
end)

browser:on("login", function(username, password)
	local pl = Native.PlayerId()
	Server:Trigger("login:login", username, password)
end)
