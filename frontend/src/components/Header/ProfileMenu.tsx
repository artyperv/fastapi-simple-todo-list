import { useSessionContext } from "@/context/SessionContext";
import Button from "@/ui/Button";
import Popover, { PopoverProps } from "@/ui/Popover";
import VStack from "@/ui/VStack";
import { breakpoints } from "@/utils/breakpoints";
import styled from "@emotion/styled";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

interface Props extends PopoverProps {
}

const ProfileMenu = ({
    ...props
}: Props) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { logOut } = useSessionContext();
    const navigate = useNavigate()

    const isMobile = useMediaQuery({ maxWidth: parseInt(breakpoints.tabletL) });

    const onLogOut = async () => {
        setIsLoggingOut(true);
        await logOut()
        setIsLoggingOut(false);
        navigate({ to: "/", search: true });
    }

    return (
        <Popover key="profile-menu-popover" {...props}>
            <MenuOptions gap="$8" isMobile={isMobile}>
                <Button
                    size="medium"
                    onClick={onLogOut}
                    loading={isLoggingOut}
                    style={{
                        color: "var(--color-text-basic)",
                        backgroundColor: "inherit",
                        justifyContent: "flex-start",
                    }}
                >
                    Выйти из аккаунта
                </Button>
            </MenuOptions>
        </Popover>
    )
}

export default ProfileMenu;

const MenuOptions = styled(VStack) <{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? "100%" : "auto")};
  padding: var(--space-10);
  border-radius: var(--radius-l);
  align-items: stretch;
  background-color: var(--color-bg-action-secondary);
`;
