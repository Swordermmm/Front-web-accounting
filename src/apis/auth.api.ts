  export async function login(email: string, password: string) {
    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(
        "http://95.163.222.188:4999/api/Auth/login",
        {
          method: "POST",
          body: JSON.stringify(data),
          credentials: "include",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      return "";
    }
  }

export const logout = () => {
  localStorage.removeItem("user");
};
