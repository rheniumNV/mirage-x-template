import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const args = process.argv.slice(2);

if (
  typeof args[0] !== "string" &&
  typeof args[1] !== "string" &&
  typeof args[2] !== "string" &&
  typeof args[3] !== "string"
)
  throw new Error(
    "invalid args. set resonite username and password and cloud variable path and new value"
  );

const resUsername = args[0];
const resPassword = args[1];
const cloudVariablePath = args[2];
const newValue = args[3];

const main = async () => {
  console.log("start login", resUsername);

  const {
    data: { entity: userSession },
  } = await axios.post(
    "https://api.resonite.com/userSessions",
    {
      username: resUsername,
      authentication: { $type: "password", password: resPassword },
      secretMachineId: uuidv4(),
      rememberMe: true,
    },
    {
      headers: {
        UID: Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 10).toString()
        ).join(""),
      },
    }
  );

  console.log("start update", cloudVariablePath, newValue);

  await axios.put(
    `https://api.resonite.com/users/${userSession.userId}/vars/${cloudVariablePath}`,
    { value: newValue },
    {
      headers: {
        Authorization: `res ${userSession.userId}:${userSession.token}`,
      },
    }
  );
};

main();
