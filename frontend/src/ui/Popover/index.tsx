import useWindowWidth from "@/hooks/useWindowWidth";
import { breakpoints } from "@/utils/breakpoints";
import styled from "@emotion/styled";
import { motion } from "motion/react";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

export interface PopoverProps {
    isOpen: boolean;
    onClose: () => void;
    triggerButtonRef: RefObject<HTMLDivElement>;
    gapFromTriggerButton?: number;
    useBackdrop?: boolean;
    children?: React.ReactNode;
    defaultHorizontalPosition?: 'left' | 'right'; // New prop for default horizontal position
    defaultVerticalPosition?: 'top' | 'bottom'; // New prop for default vertical position
    zIndex?: number;
}

const Popover = ({
    isOpen,
    onClose,
    triggerButtonRef,
    gapFromTriggerButton = 16,
    useBackdrop = true,
    children,
    defaultHorizontalPosition = 'right',
    defaultVerticalPosition = 'bottom',
    zIndex = 11,
}: PopoverProps) => {
    const [visible, setVisible] = useState(isOpen);
    const [clickStartedInOverlay, setClickStartedInOverlay] = useState(false);
    const [buttonPosition, setButtonPosition] = useState<{ top: number, left: number, width: number, height: number } | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isMobile = useMediaQuery({ maxWidth: parseInt(breakpoints.tabletL) });
    const screenWidth = useWindowWidth();

    useEffect(() => {
        if (triggerButtonRef.current) {
            const rect = triggerButtonRef.current.getBoundingClientRect();
            setButtonPosition({
                top: rect.top + window.scrollY, // Adjust for scroll
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height,
            });
        }
    }, [triggerButtonRef, screenWidth, isOpen]);

    useEffect(() => {
        if (buttonPosition && dropdownRef.current) {
            const dropdownRect = dropdownRef.current.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // Calculate horizontal position
            let dropdownLeft = buttonPosition.left;
            if (defaultHorizontalPosition === 'left') {
                dropdownLeft = buttonPosition.left + buttonPosition.width - dropdownRect.width; // Align right edge
            }

            // Ensure the dropdown does not overflow the screen horizontally
            if (dropdownLeft + dropdownRect.width > screenWidth) {
                dropdownLeft = buttonPosition.left + buttonPosition.width - dropdownRect.width;
                if (dropdownLeft + dropdownRect.width > screenWidth) {
                    dropdownLeft = screenWidth - dropdownRect.width; // Align to the right edge of the screen
                }
            } else if (dropdownLeft < 0) {
                dropdownLeft = buttonPosition.left;
                if (dropdownLeft < 0) {
                    dropdownLeft = 0; // Align to the left edge of the screen
                }
            }

            // Calculate vertical position
            let dropdownTop = buttonPosition.top + buttonPosition.height + gapFromTriggerButton; // Default: Place below button
            if (defaultVerticalPosition === 'top') {
                dropdownTop = buttonPosition.top - dropdownRect.height - gapFromTriggerButton; // Place above button
            }

            // Ensure the dropdown does not overflow the screen vertically
            if (dropdownTop + dropdownRect.height > screenHeight) {
                dropdownTop = buttonPosition.top - dropdownRect.height - gapFromTriggerButton; // Place above button if it doesn't fit below
            } else if (dropdownTop < 0) {
                dropdownTop = buttonPosition.top + buttonPosition.height + gapFromTriggerButton; // Place below button if it doesn't fit above
            }

            setDropdownPosition({ top: dropdownTop, left: dropdownLeft });
        }
    }, [buttonPosition, visible, defaultHorizontalPosition, defaultVerticalPosition, gapFromTriggerButton]);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        } else {
            const timer = setTimeout(() => setVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setClickStartedInOverlay(true);
        }
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        if (clickStartedInOverlay && event.target === event.currentTarget) {
            onClose();
        }
        setClickStartedInOverlay(false);
    };

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const actionsVariantsMobile = {
        hidden: { opacity: 0, y: "50%" },
        visible: { opacity: 1, y: 0 },
    };

    const actionsVariantsDesctop = {
        hidden: { opacity: 0, y: "50%" },
        visible: { opacity: 1, y: 0 },
    };

    if (!visible) return null;

    return (
        <Overlay
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            useBackdrop={useBackdrop}
            zIndex={zIndex}
        >
            <Actions
                ref={dropdownRef}
                initial="hidden"
                animate={isOpen ? "visible" : "hidden"}
                variants={isMobile ? actionsVariantsMobile : actionsVariantsDesctop}
                transition={{ duration: 0.15 }}
                isMobile={isMobile}
                style={isMobile ? {} : {
                    top: dropdownPosition?.top ?? "auto",
                    left: dropdownPosition?.left ?? "auto",
                    minWidth: buttonPosition ? buttonPosition.width : undefined,
                }}
            >
                {children}
            </Actions>
        </Overlay>
    )
}

export default Popover;

const Overlay = styled(motion.div) <{ useBackdrop?: boolean, zIndex?: number }>`
  position: fixed;
  inset: 0;
  ${({ useBackdrop }) => useBackdrop && `
      background: rgba(21, 21, 21, 0.1);
      -webkit-backdrop-filter: blur(8px);
      -moz-backdrop-filter: blur(8px);
      -o-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
  `}
  z-index: ${({ zIndex }) => zIndex || 11};
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${breakpoints.tabletM}) {
    max-height: 100vh;
    overflow-y: auto;
  }
`;

const Actions = styled(motion.div) <{ isMobile: boolean }>`
  position: absolute;
  bottom: ${({ isMobile }) => (isMobile ? 0 : "unset")};
  width: ${({ isMobile }) => (isMobile ? "100%" : "auto")};
  padding: ${({ isMobile }) => (isMobile ? "var(--space-16)" : 0)};
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: var(--space-8);

  pointer-events: none;
  & > * {
    pointer-events: auto; /* Allow interaction with child elements */
  }
`;
