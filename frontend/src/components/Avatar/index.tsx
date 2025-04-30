import { PaletteColors } from "@/styles/colors";
import HStack from "@/ui/HStack";
import Icon from "@/ui/Icon";
import Spinner from "@/ui/Spinner";
import Text, { TextVariants } from "@/ui/Text";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useMemo } from "react";

type AvatarSize = "m" | "s" | "xs";
const SIZE_MAPPING: Record<string, keyof typeof TextVariants> = {
    xs: "display5",
    s: "display4",
    m: "display3",
};

type AvatarImage = {
    url: string;
    blurhash?: string;
}

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
    colored?: PaletteColors;
    size?: AvatarSize;
    name?: string | null;
    image?: AvatarImage | null;
    isLoading?: boolean;
    userId?: string;
    showName?: boolean;
    style?: React.CSSProperties;
}

// Change it to check other colors on same id
const ROTATE_COLOR = 0;

const getColorTypeFromId = (id: string): PaletteColors => {
    const colors: PaletteColors[] = ["red", "orange", "green", "blue", "violet", "pink", "grey"];

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) % 1000; // Modulo to prevent overflow
    }
    return colors[(hash + ROTATE_COLOR) % colors.length];
};

function Avatar({ name, image, userId, isLoading = false, showName = false, size = "m", colored: coloredPassed, ...props }: RootProps) {
    const textSize = useMemo(() => SIZE_MAPPING[size], [size])
    const colored = coloredPassed || (userId ? getColorTypeFromId(userId) : "violet")
    return (
        <HStack gap="$16" style={{ alignItems: "center" }} {...props}>
            <Circle size={size} style={{ backgroundColor: `var(--color-bg-palette-${colored})` }}>
                {image ? (
                    <Image
                        src={image.url}
                        alt={name || undefined}
                    />
                ) : name ? (
                    <Text size={textSize} style={{ color: `var(--color-text-palette-${colored})`, textTransform: "uppercase" }}>
                        {name[0]}
                    </Text>
                ) : isLoading ? (
                    <Spinner color={`var(--color-text-palette-${colored})`} />
                ) : (
                    <Icon name="profile" color={`var(--color-text-palette-${colored})`} />
                )}
            </Circle>
            {showName && (
                <Text size={textSize}>
                    {name || "User"}
                </Text>
            )}
        </HStack>
    );
}

export default Avatar;

const Image = styled.img`
    width: var(--space-56);
    height: var(--space-56);
`

const Circle = styled.div <{ size: AvatarSize }>`
  width: var(--space-56);
  height: var(--space-56);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-round);
  overflow: hidden;

  ${({ size }) =>
        size === "xs" ?
            css`
              width: var(--space-32);
              height: var(--space-32);
              ${Image} {
                  width: var(--space-32);
                  height: var(--space-32);
              }
          `
            : size === "s" ? css`
              width: var(--space-40);
              height: var(--space-40);
              ${Image} {
                  width: var(--space-40);
                  height: var(--space-40);
              }
          `
                : css``
    }
`;
