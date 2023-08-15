import axios from "axios";

const args = process.argv.slice(2);

if (
  typeof args[0] !== "string" &&
  typeof args[1] !== "string" &&
  typeof args[2] !== "string" &&
  typeof args[3] !== "string"
)
  throw new Error(
    "invalid args. set neos username and password and cloud variable path and new value"
  );

const neosUsername = args[0];
const neosPassword = args[1];
const cloudVariablePath = args[2];
const newValue = args[3];

const main = async () => {
  console.log("start login", neosUsername);

  const { data: userSession } = await axios.post(
    "https://api.neos.com/api/userSessions",
    {
      username: neosUsername,
      password: neosPassword,
    }
  );

  console.log("start update", cloudVariablePath, newValue);

  await axios.put(
    `https://api.neos.com/api/users/${userSession.userId}/vars/${cloudVariablePath}`,
    { value: newValue },
    {
      headers: {
        Authorization: `neos ${userSession.userId}:${userSession.token}`,
      },
    }
  );
};

main();
