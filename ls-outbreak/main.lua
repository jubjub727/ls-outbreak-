--[[

DayZ style gamemode by jubjub and vaffanculo!
Steam - http://steamcommunity.com/id/jubjub727/

Feel free to add me for support but I'll block you if you're annoying.

]]--


-- Config

local WeaponTypes = {"weapon_bat", "weapon_pistol50", "weapon_combatpdw", "weapon_microsmg", "weapon_assaultshotgun", "weapon_carbinerifle", "weapon_assaultrifle", "weapon_flare", "weapon_sniperrifle"}

local ItemList = {"assault_rifle", "soda"}

-- End Config

-- Advanced

local ItemTypes = {"weapon", "food"}

local ItemData = {{"assault_rifle", "Assault Rifle", "w_ar_assaultrifle", "weapon", "weapon_assaultrifle"}, {"soda", "Soda", "prop_food_bs_soda_01", "food", 10}}

-- End Advanced


-- Actual Code

AddClientScript("sha1.lua")
AddClientScript("playerMain.lua")

--local sha2 = dofile("sha2.lua")

local conn

local Items = {}

local Players = {}

local function getUID(ply)
    for k,v in pairs(Players) do
        if v[2]:getID() == ply:getID() then
            return v[1]
        end
    end
    return -1
end

local function getLastPos(ply)
    local uid = getUID(ply)

    local result = conn:query("SELECT lastX, lastY, lastZ FROM positionData WHERE uid = %s;", uid)

    if not (result[1] == nil) then
        return result[1].lastX, result[1].lastY, result[1].lastZ
    else
        conn:noQuery("INSERT INTO positionData (uid, lastX, lastY, lastZ) VALUES (%s, 0, 0, 0);", uid)
        ply:giveWeapon(-72657034, 1)

        math.randomseed(os.time())

        local x = math.random(-1000, 1000)
        local y = math.random(-1000, 1000)
        local z = 400

        return x,y,z
    end
end

local function spawnPlayer(ply)
    local x,y,z = getLastPos(ply)
    ply:setPosition(x,y,z)
end

local function loadMySQL()
    print("Initialising MySQL")
    conn = MySQL:Connect("27.100.36.9", "outbreak", "orangetest", "fucknativeui")

    -- Initial Setup if no tables exist
    conn:query("CREATE TABLE IF NOT EXISTS users( uid int NOT NULL AUTO_INCREMENT, username varchar(256) NOT NULL, password varchar(64) NOT NULL, email varchar(128), PRIMARY KEY (uid) );")
    conn:query("CREATE TABLE IF NOT EXISTS positionData( uid int NOT NULL, lastX float, lastY float, lastZ float );")
    print("Done Initialising MySQL")
end

local function Register(ply, username, password, email)
    local result = conn:query("SELECT uid, username, password FROM users WHERE username = '%s';", username)

    if not (result[1] == nil) then
        return false
    else
        conn:noQuery("INSERT INTO users (username, password, email) VALUES ('%s','%s','%s');", username, password, email)
        local res = conn:query("SELECT uid FROM users WHERE username = '%s';", username)
        table.insert(Players, {res[1].uid, ply})
        return true
    end
end

local function Login(ply, username, password)
    --local passHash = sha2.hash256(password)
	print("User "..username.." Logging In")
    local result = conn:query("SELECT uid, username, password FROM users WHERE username = '%s' AND password = '%s';", username, password)

	if not (result[1] == nil) then
        table.insert(Players, {result[1].uid, ply})
        return true
    else
        print("User "..username.." Wrong Password")
        return false
    end
end

Player:On("login:login", function(ply, username, password) 
	if (Login(ply, username, password)) then
        spawnPlayer(ply)
		Player:TriggerClient("closemenus")
    else
        ply:kick()
    end
end)

Player:On("login:register", function(ply, username, password, email) 
	if (Register(ply, username, password, email)) then
        spawnPlayer(ply)
		Player:TriggerClient("closemenus")
    else
        ply:kick()
    end
end)

Player:On("disconnect", function(ply) -- When a player disconnects go through our table and find them and remove them from our table
    for k,v in pairs(Players) do
        if ply:getID() == v[2]:getID() then
            local x,y,z = ply:getPosition()
            conn:noQuery("UPDATE positionData SET lastX = %s, lastY = %s, lastZ = %s WHERE uid=%s;", x, y, z, v[1])
            table.remove(Players, k)
        end
    end
end )

Player:On("command", function(ply, cmd, params)
    local x,y,z = ply:getPosition()
    if cmd == "object" then
        for k,v in pairs(ItemList) do
            if v == params[1] then
                local obj = Object:Create(ItemData[k][3], x, y, z, false)
                local name = ItemData[k][2]
                table.insert(Items, {name,obj})
            end
        end
    end

    if cmd == "clear" then
        for k,v in pairs(Items) do
            v[2]:delete()
        end

        Items = {}
    end
end )

local function Setup() -- Called before anything for things that need to be setPosition
    
    loadMySQL() -- Initialise any MySQL related features


end

Setup()