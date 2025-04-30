import React, { Component, type RefObject } from "react";
import HStack from "../HStack";
import Input from "../Input";


interface IState {
    focusedInput: number;
    otpText: string[];
}

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    defaultValue: string;
    inputCount: number;
    containerStyle: React.CSSProperties;
    textInputStyle: React.CSSProperties;
    inputCellLength: number;
    handleTextChange(text: string): void;
    handleCellTextChange?(text: string, cellIndex: number): void;
}

class OTPTextView extends Component<IProps, IState> {
    static defaultProps: Partial<IProps> = {
        defaultValue: "",
        inputCount: 4,
        inputCellLength: 1,
        containerStyle: {},
        textInputStyle: {},
        handleTextChange: () => { },
        autoComplete: "one-time-code",
        autoFocus: true,
    };

    private inputs: RefObject<HTMLInputElement>[] = [];

    constructor(props: IProps) {
        super(props);
        this.state = {
            focusedInput: 0,
            otpText: this.getOTPTextChunks(
                props.inputCount,
                props.inputCellLength,
                props.defaultValue,
            ),
        };
        this.inputs = Array.from({ length: props.inputCount }, () =>
            React.createRef<HTMLInputElement>(),
        );
    }

    getOTPTextChunks = (
        inputCount: number,
        inputCellLength: number,
        text: string,
    ): string[] => {
        const matches =
            text.match(new RegExp(`.{1,${inputCellLength}}`, "g")) || [];
        return matches.slice(0, inputCount);
    };

    basicValidation = (text: string): RegExpMatchArray | null => {
        const validText = /^[0-9a-zA-Z]*$/; // Allow empty string for backspace
        return text.match(validText);
    };

    onTextChange = (text: string, i: number) => {
        const {
            inputCellLength,
            inputCount,
            handleTextChange,
            handleCellTextChange,
        } = this.props;

        if (text && !this.basicValidation(text)) {
            return;
        }

        this.setState(
            (prevState) => {
                const otpText = [...prevState.otpText];
                otpText[i] = text;
                return { otpText };
            },
            () => {
                handleTextChange(this.state.otpText.join(""));
                handleCellTextChange?.(text, i);

                if (text.length === inputCellLength && i < inputCount - 1) {
                    this.inputs[i + 1].current?.focus();
                }
            },
        );
    };

    onInputFocus = (i: number) => {
        const { otpText } = this.state;
        const prevIndex = i - 1;

        if (prevIndex > -1 && !otpText[prevIndex] && !otpText.join("")) {
            this.inputs[prevIndex].current?.focus();
            return;
        }

        this.setState({ focusedInput: i });
    };

    onKeyUp = (
        e: React.KeyboardEvent<HTMLInputElement>,
        i: number,
    ) => {
        const val = this.state.otpText[i] || "";
        const { handleTextChange, inputCellLength, inputCount } = this.props;

        if (e.key !== "Backspace" && val && i < inputCount - 1) {
            this.inputs[i + 1].current?.focus();
            return;
        }

        if (e.key === "Backspace" && i > 0) {
            if (!val.length && this.state.otpText[i - 1].length === inputCellLength) {
                this.setState(
                    (prevState) => {
                        const otpText = [...prevState.otpText];
                        otpText[i - 1] = otpText[i - 1].slice(0, -1);
                        return { otpText };
                    },
                    () => {
                        handleTextChange(this.state.otpText.join(""));
                        this.inputs[i - 1].current?.focus();
                    },
                );
            }
        }
    };

    clear = () => {
        this.setState({ otpText: [] }, () => {
            this.inputs[0].current?.focus();
            this.props.handleTextChange("");
        });
    };

    setValue = (value: string, isPaste = false) => {
        const { inputCount, inputCellLength } = this.props;
        const updatedFocusInput = isPaste ? inputCount - 1 : value.length - 1;

        this.setState(
            {
                otpText: this.getOTPTextChunks(inputCount, inputCellLength, value),
            },
            () => {
                this.inputs[updatedFocusInput].current?.focus();
                this.props.handleTextChange(value);
            },
        );
    };

    render() {
        const {
            inputCount,
            containerStyle,
            autoFocus,
            ...textInputProps
        } = this.props;

        const { focusedInput, otpText } = this.state;

        const TextInputs = Array.from({ length: inputCount }, (_, i) => (
            <Input key={`otp-input-${i}`}>
                <Input.Field
                    ref={this.inputs[i]}
                    key={`otp-input-field-${i}`}
                    placeholder="0"
                    autoFocus={autoFocus && i === 0}
                    value={otpText[i] || ""}
                    maxLength={this.props.inputCellLength}
                    onFocus={() => this.onInputFocus(i)}
                    onChange={(e) => this.onTextChange(e.target.value, i)}
                    onKeyUp={(e) => this.onKeyUp(e, i)}
                    style={{
                        outlineStyle: "none",
                        textAlign: "center",
                        borderWidth: focusedInput === i ? 2 : 0,
                        width: "var(--space-56)",
                    }}
                    {...textInputProps}
                />
            </Input>
        ));

        return (
            <HStack
                gap="$12"
                style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    ...containerStyle
                }}
            >
                {TextInputs}
            </HStack>
        );
    }
}

export default OTPTextView;
