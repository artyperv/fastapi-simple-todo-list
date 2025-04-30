
import PaddingWrapper from "@/components/ContentPaddingWrapper";
import PageLayout from "@/components/PageLayout";
import { Route as indexRoute } from "@/routes";
import { Route } from "@/routes/__root";
import Button from "@/ui/Button";
import Center from "@/ui/Center";
import Text from "@/ui/Text";
import VStack from "@/ui/VStack";
import { NotFoundRouteProps } from "@tanstack/react-router";


function NotFoundPage({ }: NotFoundRouteProps) {
    const navigate = Route.useNavigate();

    const handleDismissError = () => {
        navigate({ to: indexRoute.to, search: true });
    }

    return (
        <PageLayout>
            <PaddingWrapper style={{ display: "flex", flex: 1 }}>
                <Center style={{ flex: 1 }}>
                    <VStack gap="$40" style={{ alignItems: "center" }}>
                        <Text size="display1" style={{ textAlign: "center" }}>404</Text>
                        <Text size="textM" style={{ textAlign: "center" }}>Sorry, but this page does not exist</Text>
                        <Button onClick={handleDismissError}>Back to the main page</Button>
                    </VStack>
                </Center>
            </PaddingWrapper>
        </PageLayout>
    );
}

export default NotFoundPage;
