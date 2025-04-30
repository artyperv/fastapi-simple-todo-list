import { breakpoints } from "@/utils/breakpoints";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "motion/react";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import Text from "../Text";

interface Props extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  style?: React.CSSProperties;
  footer?: boolean;
  header?: boolean;
  cancelColor?: string;
  footerText?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  style,
  cancelColor,
  footer,
  header = true,
  footerText = "Назад",
}: Props) => {
  const [visible, setVisible] = useState(isOpen);
  const [clickStartedInOverlay, setClickStartedInOverlay] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
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

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1 },
  };

  const contentVariantsMobile = {
    hidden: { opacity: 0, y: 500 },
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
      footer={footer}
    >
      <StyledPaddingWrapper>
        <Content
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
          variants={footer ? contentVariantsMobile : contentVariants}
          transition={{ duration: 0.15 }}
          style={{
            ...style,
          }}
        >
          {(header || window.innerHeight <= 670) && (
            <ContentHeaderCancel
              onClick={onClose}
              color={cancelColor ?? "#6a75e1"}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.48443 1.15864C2.11781 0.792021 1.52341 0.792021 1.15679 1.15864C0.790179 1.52525 0.790179 2.11965 1.15679 2.48627L10.6715 12.001L1.15777 21.5147C0.791156 21.8813 0.791156 22.4757 1.15777 22.8424C1.52439 23.209 2.11879 23.209 2.48541 22.8424L11.9991 13.3286L21.5137 22.8432C21.8804 23.2098 22.4748 23.2098 22.8414 22.8432C23.208 22.4766 23.208 21.8822 22.8414 21.5156L13.3268 12.001L22.8424 2.48536C23.209 2.11874 23.209 1.52435 22.8424 1.15773C22.4758 0.791115 21.8814 0.791114 21.5148 1.15773L11.9991 10.6734L2.48443 1.15864Z" />
              </svg>
            </ContentHeaderCancel>
          )}

          {children}
        </Content>
        {footer && window.innerHeight >= 670 && (
          <motion.div
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            variants={
              breakpoints.tabletM && window.innerHeight <= 670
                ? contentVariantsMobile
                : contentVariants
            }
            style={{ alignSelf: "flex-end" }}
            transition={{ duration: 0.15 }}
          >
            <Text
              onClick={onClose}
              size="labelM"
              as="p"
              style={{
                textAlign: "center",
                fontWeight: 400,
                color: "var(--color-text-static-white)",
                padding: 28,
              }}
            >
              {footerText ?? "Назад"}
            </Text>
          </motion.div>
        )}
      </StyledPaddingWrapper>
    </Overlay>
  );
};

export default Modal;

const ContentHeaderCancel = styled.button<{ color: string }>`
  position: absolute;
  right: var(--space-16);
  top: var(--space-16);
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: var(--space-20);
  height: var(--space-20);
  cursor: pointer;
  z-index: 5;
  transition: opacity 0.2s ease-in-out;

  svg path {
    fill: ${({ color }) => color};
  }

  &:hover {
    opacity: 0.8;
  }

  /* ${({ color }) =>
    color &&
    css`
      opacity: 0.5;

      &:hover {
        opacity: 0.3;
      }
    `} */

  &:focus-visible {
    outline: 2px solid var(--color-violet-500);
    outline-offset: 2px;
  }
`;

const Overlay = styled(motion.div) <{ footer?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(21, 21, 21, 0.645);
  -webkit-backdrop-filter: blur(8px);
  -moz-backdrop-filter: blur(8px);
  -o-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  z-index: 10;
  display: flex;
  justify-content: center;
  max-width: 100vw;
  align-items: ${({ footer }) =>
    footer && window.innerHeight >= 670 ? "flex-end" : "center"};

  @media (max-width: ${breakpoints.tabletM}) {
    max-height: 100vh;
    overflow-y: auto;
  }
`;

const Content = styled(motion.div)`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-base);
  padding: var(--space-24);
  border-radius: var(--radius-xl);
  position: relative;
  flex: 1;

  @media (max-width: ${breakpoints.tabletM}) {
    max-height: 90vh;
    width: 100%;
  }

  @media (max-width: ${breakpoints.mobileM}) {
    overflow-y: auto;
    max-height: 90vh;
  }
`;

const StyledPaddingWrapper = styled.div`
  padding: 0 var(--space-8);

  @media (max-width: ${breakpoints.tabletM}) {
    width: 100%;
  }
`;
