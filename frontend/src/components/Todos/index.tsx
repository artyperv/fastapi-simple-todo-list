import { TodoOut } from "@/client";
import { todosReadInvitesOptions, todosReadTodosOptions, todosReadTodosQueryKey } from "@/client/@tanstack/react-query.gen";
import Button from "@/ui/Button";
import Center from "@/ui/Center";
import Spinner from "@/ui/Spinner";
import Text from "@/ui/Text";
import VStack from "@/ui/VStack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import TodoModal from "../TodoModal";
import Invite from "./Invite";
import Todo from "./Todo";

const route = getRouteApi('/')

const statusOrder: TodoOut['status'][] = ['new', 'in_progress', 'done'];

const Todos: React.FC = () => {
  const [selectedTodo, setSelectedTodo] = useState<TodoOut | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const navigate = route.useNavigate();
  const { todo_id } = route.useSearch();

  const {
    data: todos,
    isLoading: isTodosLoading,
    error: todosError,
  } = useQuery({
    ...todosReadTodosOptions(),
  });

  const {
    data: invites,
  } = useQuery({
    ...todosReadInvitesOptions(),
  });

  useEffect(() => {
    // Get the current protocol and hostname
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';

    // Create WebSocket connection using current domain
    const ws = new WebSocket(`${protocol}//${hostname}${port}/api/v1/todos/ws`);

    ws.onopen = () => {
      console.log('Todos WebSocket Connected');
    };

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      const data = typeof parsed === "string" ? JSON.parse(parsed) : parsed;

      // Handle different types of updates
      if (data.id && !data.title) {
        // This is a deletion
        if (selectedTodo?.id === data.id) {
          handleCloseModal()
        }
        queryClient.setQueryData(todosReadTodosQueryKey(), (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((todo: TodoOut) => todo.id !== data.id)
          };
        });
      } else {
        // This is an update or creation
        queryClient.setQueryData(todosReadTodosQueryKey(), (oldData: any) => {
          if (!oldData) return oldData;

          const existingIndex = oldData.data.findIndex((todo: TodoOut) => todo.id === data.id);

          if (existingIndex >= 0) {
            // Update existing todo
            const newData = [...oldData.data];
            newData[existingIndex] = data;
            return {
              ...oldData,
              data: newData
            };
          } else {
            // Add new todo
            return {
              ...oldData,
              data: [...oldData.data, data]
            };
          }
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      // Attempt to reconnect after a delay
      setTimeout(() => {
        // Reconnect logic could be added here
      }, 5000);
    };

    // Cleanup function
    return () => {
      ws.close();
    };
  }, [queryClient]);

  const handleCloseModal = () => {
    if (todo_id) {
      navigate({ search: (search: any) => ({ ...search, todo_id: undefined }) })
    }
  };

  useEffect(() => {
    const new_todo = todo_id && todos && todos.data.find((item) => item.id === todo_id)
    if (new_todo) {
      setSelectedTodo(new_todo);
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
      setTimeout(() => setSelectedTodo(null), 200);
    }
  }, [todo_id, todos])

  if (todosError) return null;

  const todosByStatus = todos?.data.reduce((acc, todo) => {
    if (!acc[todo.status]) {
      acc[todo.status] = [];
    }
    acc[todo.status].push(todo);
    return acc;
  }, {} as Record<TodoOut['status'], TodoOut[]>);

  return (
    <Center>
      <TodoModal
        todo={selectedTodo}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClose={handleCloseModal}
      />
      {isTodosLoading && <Spinner />}
      <VStack gap="$16" style={{ width: "100%" }}>
        <Button variant="primary" size="medium" onClick={() => setIsModalOpen(true)}>
          Создать
        </Button>
        {invites?.data && (
          <VStack gap="$8">
            {invites.data.map((invite, index) => (
              <Invite key={`invite-${index}`} invite={invite} />
            ))}
          </VStack>
        )}
        <VStack gap="$24">
          {statusOrder.map((status) => {
            const statusTodos = todosByStatus?.[status] || [];
            if (statusTodos.length === 0) return null;

            return (
              <VStack key={status} gap="$16">
                <Text size="display3" style={{ textTransform: 'capitalize' }}>
                  {status.replace('_', ' ')}
                </Text>
                <VStack key={status} gap="$8">
                  {statusTodos.map((todo, index) => (
                    <Todo key={`todo-${index}`} todo={todo} />
                  ))}
                </VStack>
              </VStack>
            );
          })}
        </VStack>
      </VStack>
    </Center>
  );
};

export default Todos;
