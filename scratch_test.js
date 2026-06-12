import axios from 'axios';

async function testRegister() {
  try {
    const data = {
      firstName: "Test",
      lastName: "User",
      phoneNumber: "1234567890",
      email: "test" + Date.now() + "@example.com",
      password: "password123"
    };

    const response = await axios.post("http://localhost:9000/api/auth/register", data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log("SUCCESS:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
  }
}

testRegister();
