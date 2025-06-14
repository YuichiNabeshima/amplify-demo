"use client";

import { useState, useEffect } from "react";
import type { Schema } from "@/amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";
import { get } from 'aws-amplify/api';
import { client } from "@/src/lib/amplifyClient";
import "./../app/app.css";


export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  async function getItem() {
    try {
      const restOperation = await get({ 
          apiName: 'myHttpApi',
          path: '/booking' 
      }).response;
      const response = restOperation;
      console.log('GET call succeeded: ', await response.body.json());
    } catch (error) {
      console.log('GET call failed: ', error);
    }
  }

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
    getItem();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{`${todo.content}`}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
