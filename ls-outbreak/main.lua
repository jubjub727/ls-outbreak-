--[[

DayZ style gamemode by jubjub and vaffanculo!
Steam - http://steamcommunity.com/id/jubjub727/

Feel free to add me for support but I'll block you if you're annoying.

]]--


-- Config

local WeaponTypes = {"weapon_bat", "weapon_pistol50", "weapon_combatpdw", "weapon_microsmg", "weapon_assaultshotgun", "weapon_carbinerifle", "weapon_assaultrifle", "weapon_flare", "weapon_sniperrifle"}

-- End Config

-- Advanced

-- End Advanced


-- Actual Code

AddClientScript("playerMain.lua")

--local sha2 = dofile("sha2.lua")

local conn

local Players = {}

Player:On("login:login", function(ply, username, password) 
	if (Login(ply, username, password)) then
        ply:setPosition(0,0,0)
		Player:TriggerClient("closemenus")
    else
        ply:kick()
    end
end)

Player:On("disconnect", function(ply) -- When a player disconnects go through our table and find them and remove them from our table
    for k,v in pairs(Players) do
        if ply:getID() == v[2]:getID() then
            table.remove(Players, k)
        end
    end
end )

local function loadMySQL()
    print("Initialising MySQL")
    conn = MySQL:Connect("27.100.36.9", "outbreak", "orangetest", "fucknativeui")

    -- Initial Setup if no tables exist
    conn:query("CREATE TABLE IF NOT EXISTS users( uid int NOT NULL, username varchar(256) NOT NULL, password varchar(64));")
    print("Done Initialising MySQL")
end

function Login(ply, username, password)
    --local passHash = sha2.hash256(password)
	print("User "..username.." Logging In")
    local result = conn:query("SELECT uid, username, password FROM users WHERE username = '%s' AND password = '%s';", username, password)

	if not (result[1] == nil) then
        table.insert(Players, {result.uid, ply})
        return true
    else
        print("User "..username.." Wrong Password")
        return false
    end
end

local function Setup() -- Called before anything for things that need to be setPosition
    
    loadMySQL() -- Initialise any MySQL related features


end

Setup()