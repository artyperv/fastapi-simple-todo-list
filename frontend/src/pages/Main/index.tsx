import PaddingWrapper from "@/components/ContentPaddingWrapper";
import LogInForm from "@/components/LogInForm";
import PageLayout from "@/components/PageLayout";
import Todos from "@/components/Todos";
import { useSessionContext } from "@/context/SessionContext";
import Center from "@/ui/Center";
import Logo from "@/ui/Logo/Logo";
import Spinner from "@/ui/Spinner";
import VStack from "@/ui/VStack";
import styled from '@emotion/styled';


function MainPage() {
  const { session, isLoading } = useSessionContext();

  return isLoading ? (
    <Center>
      <Spinner />
    </Center>
  ) : !session ? (
    <Center>
      <LogInFormWrapper gap="$40">
        <Logo />
        <LogInForm reasonText="Register or login to view your todos" />
      </LogInFormWrapper>
    </Center>
  ) : (
    <PageLayout>
      <PaddingWrapper style={{ display: "flex", flexDirection: "column", gap: "var(--space-24)" }}>
        <Todos />
      </PaddingWrapper>
    </PageLayout>
  );
}


export default MainPage;

const LogInFormWrapper = styled(VStack)`
  align-items: center;
  background-color: var(--color-bg-base);
  padding: var(--space-24);
  border-radius: var(--radius-xl);
`;