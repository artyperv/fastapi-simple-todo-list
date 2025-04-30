import { breakpoints } from "@/utils/breakpoints";
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";

import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import Logo from "@/ui/Logo/Logo";

import { usersReadUserMeOptions } from "@/client/@tanstack/react-query.gen";
import { useSessionContext } from "@/context/SessionContext";
import Link from "@/ui/Link";
import Modal from "@/ui/Modal";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import Avatar from "../Avatar";
import LogInForm from "../LogInForm";
import ProfileMenu from "./ProfileMenu";

export type HeaderProps = {
  showProfile?: boolean
}

const Header: React.FC<HeaderProps> = ({ showProfile = true }) => {
  const { session } = useSessionContext();
  const navigate = useNavigate()

  const [isProfileMenuOpened, setIsProfileMenuOpened] = useState(false);
  const [zIndex, setZIndex] = useState(isProfileMenuOpened ? 12 : "unset");
  const profileButtonRef = useRef(null);

  const [showLogin, setShowLogin] = useState(false);

  const {
    data: user,
    isLoading: isUserLoading,
    refetch: refetchUser
  } = useQuery({
    ...usersReadUserMeOptions(),
    enabled: !!session && showProfile
  })

  const handleUnregisteredAvatarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogin(true);
  }

  const onLoginSuccess = () => {
    setShowLogin(false);
    refetchUser();
    navigate({ to: "/", search: true });
  }

  useEffect(() => {
    if (isProfileMenuOpened) {
      setZIndex(13);
    } else {
      const timeout = setTimeout(() => setZIndex("unset"), 200);
      return () => clearTimeout(timeout);
    }
  }, [isProfileMenuOpened]);

  return (
    <HeaderWrapper>
      <Container>
        <LogoWrapper to="/" search>
          <Logo />
        </LogoWrapper>
        <UserBlock>
          <ThemeToggle />
          {showProfile && (
            <>
              <ProfileMenu
                isOpen={isProfileMenuOpened}
                onClose={() => setIsProfileMenuOpened(false)}
                triggerButtonRef={profileButtonRef}
                useBackdrop={true}
              />
              <Link ref={profileButtonRef} onClick={!session ? handleUnregisteredAvatarClick : () => setIsProfileMenuOpened(isProfileMenuOpened ? false : true)} style={{ zIndex }}>
                <Avatar isLoading={isUserLoading} name={user?.name} image={user?.profile_image} showName={false} size="s" userId={user?.id} />
              </Link>
            </>
          )}
        </UserBlock>
      </Container>
      {!session && showProfile && (
        <Modal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
        >
          <LogInForm
            titleText="Присоединяйся к Дому!"
            onSuccess={onLoginSuccess}
            includeLogo
          />
        </Modal>
      )}
    </HeaderWrapper>
  );
};

export default Header;

const HeaderWrapper = styled.header`
  background-color: var(--color-bg-base);
`;

const Container = styled.div`
  max-width: ${breakpoints.desktop};
  display: flex;
  justify-content: space-between;
  gap: var(--space-16);
  align-items: center;
  min-height: var(--space-56);
  padding: 0 var(--space-24);
  margin: 0 auto;
`;

const LogoWrapper = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-72);
  cursor: pointer;
`;

const UserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-24);
`;
