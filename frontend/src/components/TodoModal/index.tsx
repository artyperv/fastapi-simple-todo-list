import {
  todosCreateInvite,
  todosCreateTodo, todosDeleteTodo, todosUpdateTodo,
  type UserCreateOpen as User,
} from "@/client";
import { todosReadTodosQueryKey } from "@/client/@tanstack/react-query.gen";
import { TodoCreate, TodoOut, TodoUpdate } from "@/client/types.gen";
import { useSessionContext } from "@/context/SessionContext";
import Button from "@/ui/Button";
import FormControl from "@/ui/FormControl";
import Icon from "@/ui/Icon";
import Input from "@/ui/Input";
import Modal from "@/ui/Modal";
import Text from "@/ui/Text";
import VStack from "@/ui/VStack";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input/input";
import Avatar from "../Avatar";

interface Props {
  todo: TodoOut | null;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onClose: () => void;
}

const TodoModal = ({ todo, isOpen, setIsOpen, onClose }: Props) => {
  const { session: userId } = useSessionContext();
  const [isAddUserInputShown, setIsAddUserInputShown] = useState(false);
  const [isAddUserSentShown, setIsAddUserSentShown] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
    formState
  } = useForm<TodoUpdate>({
    shouldUnregister: false,
    mode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      title: todo?.title || "",
      description: todo?.description || "",
      status: todo?.status || "new",
      user_ids: todo?.users?.map(user => user.id) || []
    },
  });

  const { isDirty } = formState;

  const {
    control: addMemberControl,
    handleSubmit: addMemberHandleSubmit,
  } = useForm<User>({
    shouldUnregister: false,
    mode: "onSubmit",
    criteriaMode: "all",
    defaultValues: {
      phone: "",
    },
  });

  useEffect(() => {
    setValue("title", todo?.title || "")
    setValue("description", todo?.description || "")
    setValue("status", todo?.status || "new")
    setValue("user_ids", todo?.users?.map(user => user.id) || [])
  }, [todo, isOpen])

  const onSubmit: SubmitHandler<TodoCreate> = async (data: TodoUpdate) => {
    if (!todo) {
      await todosCreateTodo({ body: data })
    } else {
      await todosUpdateTodo({
        body: data,
        path: {
          todo_id: todo.id
        }
      })
    }
    await queryClient.invalidateQueries({ queryKey: todosReadTodosQueryKey() })
  };

  const handleChangeStatus = async () => {
    if (todo) {
      const nextStatus = todo.status === 'new' ? 'in_progress' : todo.status === 'in_progress' ? 'done' : 'delete';
      if (nextStatus === 'delete') {
        await todosDeleteTodo({ path: { todo_id: todo.id } })
        await queryClient.invalidateQueries({ queryKey: todosReadTodosQueryKey() })
        handleClose()
      } else {
        await onSubmit({ ...todo, status: nextStatus })
      }
    }
  }

  const onAddMemberSubmit: SubmitHandler<User> = async (data: User) => {
    if (todo) {
      await todosCreateInvite({ query: { todo_id: todo.id, user_phone: Number(data.phone) } })
      setIsAddUserSentShown(true);
      setIsAddUserInputShown(false);
      setTimeout(() => setIsAddUserSentShown(false), 3000);
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setIsAddUserInputShown(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <VStack gap="$40" style={{ flex: 1, alignItems: "center" }}>
        <VStack gap="$16" style={{ flex: 1, minWidth: 300 }}>
          <Text>Task info</Text>
          <VStack gap="$8">
            <Controller
              control={control}
              name="title"
              rules={{
                required: {
                  value: true,
                  message: "Обязательное поле"
                }
              }}
              render={({ field, fieldState: { invalid }, formState: { isSubmitting } }) => (
                <FormControl
                  isDisabled={isSubmitting}
                  isInvalid={invalid}
                  isReadOnly={isSubmitting}
                  isRequired={true}
                >
                  <Input>
                    <Input.Field
                      name="title"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      autoComplete="off"
                      placeholder="Title"
                    />
                  </Input>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState: { invalid }, formState: { isSubmitting } }) => (
                <FormControl
                  isDisabled={isSubmitting}
                  isInvalid={invalid}
                  isReadOnly={isSubmitting}
                  isRequired={true}
                >
                  <Input>
                    <Input.Field
                      name="description"
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      autoComplete="off"
                      placeholder="Description"
                    />
                  </Input>
                </FormControl>
              )}
            />
          </VStack>
          {todo && (
            <VStack gap="$16">
              <Text>Members</Text>
              {todo?.users && todo.users.length > 1 && (
                <VStack gap="$6">
                  {todo.users.map((user) => (
                    <Avatar name={(!user.name && userId && user.id === userId) ? "You" : user.name} image={user.profile_image} showName size="s" userId={user.id} key={`avatar-${user.id}`} />
                  ))}
                </VStack>
              )}
              {isAddUserSentShown ? (
                <Button variant="secondary" size="medium" disabled>
                  Sent
                </Button>
              ) : isAddUserInputShown ? (
                <Controller
                  control={addMemberControl}
                  name="phone"
                  rules={{
                    required: {
                      value: true,
                      message: "Обязательное поле",
                    },
                  }}
                  render={({ field, fieldState: { invalid, error }, formState: { isSubmitting } }) => (
                    <FormControl
                      isDisabled={isSubmitting}
                      isInvalid={invalid}
                      isReadOnly={isSubmitting}
                      isRequired={true}
                      style={{ alignItems: "center", width: "100%" }}
                    >
                      <VStack gap="$16" style={{ alignItems: "center" }}>
                        <Input style={{ flex: 1, minWidth: 300 }}>
                          <PhoneInput
                            name="phone"
                            country="RU"
                            international
                            withCountryCallingCode
                            countryCallingCodeEditable={false}
                            smartCaret={false}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            // @ts-ignore
                            inputComponent={Input.Field}
                            type="text"
                            keyboardType="phone-pad"
                            autoComplete="tel"
                            inputMode="tel"
                            returnKeyType="next"
                            placeholder="Обязательное поле"
                            onKeyPress={(e: React.KeyboardEvent) => {
                              if (e.key === 'Enter') {
                                e.preventDefault(); // Prevent default "Enter" behavior
                                addMemberHandleSubmit(onAddMemberSubmit)();
                              }
                            }}
                          />
                          <Button
                            variant="primary"
                            size="medium"
                            onClick={field.value.length > 0 ? addMemberHandleSubmit(onAddMemberSubmit) : () => setIsAddUserInputShown(false)}
                            style={{ marginLeft: "var(--space-8)", height: "var(--space-56)" }}
                            isIconOnly iconLeft={<Icon name={field.value.length > 0 ? "plus" : "close"} color="var(--color-text-action-primary)" />}
                          />
                        </Input>
                        <FormControl.Error>
                          <FormControl.ErrorText>
                            {error?.message}
                          </FormControl.ErrorText>
                        </FormControl.Error>
                      </VStack>
                    </FormControl>
                  )}
                />
              ) : (
                <Button variant="secondary" size="medium" onClick={() => setIsAddUserInputShown(true)} style={{ flex: 1, minWidth: 300 }}>
                  Add member
                </Button>
              )}
            </VStack>
          )}
        </VStack>
        <VStack gap="$8" style={{ justifyContent: "center" }}>
          {isDirty || !todo ? (
            <Button variant="primary" size="medium" onClick={handleSubmit(onSubmit)} style={{ flex: 1, minWidth: 300 }}>
              Save
            </Button>
          ) : (
            <Button variant={todo.status === "new" ? "fourth" : todo.status === "in_progress" ? "fifth" : "secondary"} size="medium" onClick={handleChangeStatus} style={{ flex: 1, minWidth: 300 }}>
              {todo.status === "new" ? "Start Task" : todo.status === "in_progress" ? "Done" : "Delete"}
            </Button>
          )}
        </VStack>
      </VStack>
    </Modal>
  );
};

export default TodoModal;
