import React, { useEffect, useState } from "react";
import axios from "axios";


const ProtectedAuth = () => {
    const [auth, setAuth] = useState(false);
    const [username, setUsername] = useState(false);
    
    useEffect(() => {
      axios.get("http://localhost:3002/").then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setUsername(res.data.username);
          console.log("Username" + username);
        }
      });
    }, []);

    return{
        auth, 
        setAuth
    };
  
};

export default ProtectedAuth