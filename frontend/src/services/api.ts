export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("crm_auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

class Api {
  async get(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        ...authHeaders()
      }
    });

    if (!response.ok) {
      throw new Error("Erro na requisição.");
    }

    return response.json();
  }

  async post(endpoint: string, body: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async put(endpoint: string, body: any) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async delete(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        ...authHeaders()
      }
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
  }
}

export default new Api();
