import LogInForm from '@/components/LogInForm'
import PageLayout from '@/components/PageLayout'
import { useSessionContext } from '@/context/SessionContext'
import Center from '@/ui/Center'
import Spinner from '@/ui/Spinner'
import styled from "@emotion/styled"


export function Login({ reasonText }: { reasonText?: string }) {
    const { isLoading } = useSessionContext();

    return (
        <PageLayout showProfile={false} style={{ flex: 1, display: "flex", flexDirection: "column" }} mainStyle={{ flex: 1 }}>
            <Center style={{ paddingBottom: 56 }}>
                {isLoading ? (<Spinner />) : (
                    <LogInFormWrapper>
                        <LogInForm includeLogo reasonText={reasonText} />
                    </LogInFormWrapper>
                )}
            </Center>
        </PageLayout>
    )
}

const LogInFormWrapper = styled.div`
  background-color: var(--color-bg-base);
  padding: var(--space-24);
  border-radius: var(--radius-xl);
`;