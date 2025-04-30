import { TodoOut } from "@/client";
import { TodoStatusColoredTagProps } from "@/constants/todoStatusTagProps";
import HStack from "@/ui/HStack";
import Link from "@/ui/Link";
import TagColored from "@/ui/TagColored";
import Text from "@/ui/Text";
import VStack from "@/ui/VStack";
import styled from "@emotion/styled";
import Avatar from "../Avatar";

interface Props {
  todo: TodoOut;
}

const Todo = ({
  todo,
}: Props) => {
  return (
    <TodoStyled
      title="More info..."
      search={(search: any) => ({ ...search, todo_id: todo.id })}
      to="/"
    >
      <VStack gap="$8">
        <HStack gap="$24" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <Text size="display4" as="h3" itemProp="name">
            {todo.title}
          </Text>
          <TagColored colored={TodoStatusColoredTagProps[todo.status].colored} style={{}}>
            <TagColored.Text style={{ whiteSpace: "nowrap" }}>
              {TodoStatusColoredTagProps[todo.status].defaultText}
            </TagColored.Text>
          </TagColored>
        </HStack>
        {todo.users && todo.users.length > 1 && (
          <HStack gap="$6" style={{ alignItems: "center" }}>
            {todo.users.map((user) => (
              <Avatar name={user.name} image={user.profile_image} showName={false} size="xs" userId={user.id} key={`avatar-${user.id}`} />
            ))}
          </HStack>
        )}
      </VStack>
    </TodoStyled>
  );
};

export default Todo;


export const TodoStyled = styled(Link)`
  padding: var(--space-8);
  background-color: var(--color-bg-brand-strong);
  border-radius: var(--radius-xl);
  position: relative;
  width: 100%;
`;
