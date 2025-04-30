
import PaddingWrapper from "@/components/ContentPaddingWrapper";
import PageLayout from "@/components/PageLayout";
import { Route as indexRoute } from "@/routes";
import { Route } from "@/routes/__root";
import Button from "@/ui/Button";
import Center from "@/ui/Center";
import Text from "@/ui/Text";
import VStack from "@/ui/VStack";
import { ErrorComponentProps } from "@tanstack/react-router";


function ErrorPage({ }: ErrorComponentProps) {
    const navigate = Route.useNavigate();

    const handleDismissError = () => {
        navigate({ to: indexRoute.to, search: true });
    }

    return (
        <PageLayout>
            <PaddingWrapper style={{ display: "flex", flex: 1 }}>
                <Center style={{ flex: 1 }}>
                    <VStack gap="$40" style={{ alignItems: "center" }}>
                        <Text size="display2" style={{ textAlign: "center" }}>Error happend</Text>
                        <Button onClick={handleDismissError}>Back to the main page</Button>
                    </VStack>
                </Center>
            </PaddingWrapper>
        </PageLayout>
    );
}

export default ErrorPage;
