import { json } from "react-router-dom";

type Method = "get" | "post" | "put" | "del";

export class Api {
   private async makeRequest(url: string, method: Method, body: Record<string, any> = {}) {
      const options: RequestInit = {
         method,
         headers: {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${localStorage.getItem('token') || ''}` // Token Auth
         },
      }

      if (method === 'post' || method === 'put') {
         options.body = JSON.stringify(body);
      }

      const result = await fetch(`http://localhost:3000/${url}`, options);
      const json = await result.json();
      return [result, json];
   }

   get(url: string) {
      return this.makeRequest(url, 'get');
   }

   post(url: string, body: Record<string, any>) {
      return this.makeRequest(url, 'post', body);
   }

   put(url: string, body: Record<string, any>) {
      return this.makeRequest(url, 'put', body);
   }

   del(url: string) {
      return this.makeRequest(url, 'del');
   }

   async login(body: Record<string, any>) {
      const [result, json] = await this.makeRequest('login', 'post', body);
      if (result.ok) {
         localStorage.setItem('token', json.token);
      }
      return [result, json];
   }

   async register(body: Record<string, any>) {
      const [result, json] = await this.makeRequest('users/add', 'post', body);
      if (result.ok) {
         localStorage.setItem('token', json.token);
      }
      return [result, json];
   }

   logout() {
      localStorage.clear();
   }

   async loggedIn() {
      const [result, json] = await this.makeRequest('users/', 'get');
      return result.ok;
   }
}