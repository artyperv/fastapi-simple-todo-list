import { InviteOut, todosAcceptInvite, todosDeclineInvite } from "@/client";
import { todosReadInvitesQueryKey, todosReadTodosQueryKey } from "@/client/@tanstack/react-query.gen";
import { TodoStatusColoredTagProps } from "@/constants/todoStatusTagProps";
import Button from "@/ui/Button";
import HStack from "@/ui/HStack";
import TagColored from "@/ui/TagColored";
import Text from "@/ui/Text";
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
    invite: InviteOut;
}

const Invite = ({
    invite,
}: Props) => {
    const queryClient = useQueryClient();

    const handleAccept = async () => {
        await todosAcceptInvite({ path: { invite_id: invite.id } })
        await queryClient.invalidateQueries({ queryKey: todosReadInvitesQueryKey() })
        await queryClient.invalidateQueries({ queryKey: todosReadTodosQueryKey() })
    }
    const handleDecline = async () => {
        await todosDeclineInvite({ path: { invite_id: invite.id } })
        await queryClient.invalidateQueries({ queryKey: todosReadInvitesQueryKey() })
    }

    if (!invite.todo) return null;

    return (
        <HStack gap="$8">
            <InviteStyled gap="$24" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text size="display4" as="h3" itemProp="name">
                    {invite.todo.title}
                </Text>
                <TagColored colored={TodoStatusColoredTagProps[invite.todo.status].colored} style={{}}>
                    <TagColored.Text style={{ whiteSpace: "nowrap" }}>
                        {TodoStatusColoredTagProps[invite.todo.status].defaultText}
                    </TagColored.Text>
                </TagColored>
            </InviteStyled>
            <Button variant="fifth" size="small" onClick={handleAccept}>✓</Button>
            <Button variant="fourth" size="small" onClick={handleDecline}>х</Button>
        </HStack>
    );
};

export default Invite;


export const InviteStyled = styled(HStack)`
  padding: var(--space-8);
  //background-color: var(--color-bg-brand-strong);
  border: var(--space-2) solid var(--color-bg-brand-strong);
  border-radius: var(--radius-xl);
  position: relative;
  width: 100%;
`;
