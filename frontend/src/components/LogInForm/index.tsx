import React, { useEffect, useState } from "react";

import {
    loginGetSmsCode,
    loginLogin,
    usersUpdateUserMe,
    type UserCreateOpen as User,
    type Body_login_login as UserLogin
} from "@/client";
import { useSessionContext } from "@/context/SessionContext";
import Button from "@/ui/Button";
import FormControl from "@/ui/FormControl";
import HStack from "@/ui/HStack";
import Input from "@/ui/Input";
import Logo from "@/ui/Logo/Logo";
import OTPTextView from "@/ui/OTPInput";
import Text from "@/ui/Text";
import VStack from "@/ui/VStack";
import { breakpoints } from "@/utils/breakpoints";
import { toHHMMSS } from "@/utils/miscellaneous";
import styled from "@emotion/styled";
import { AxiosError } from "axios";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input/input";

interface LogInFormProps {
    titleText?: string;
    reasonText?: string;
    onSuccess?: () => void;
    includeLogo?: boolean;
    registrationEnabled?: boolean;
    showTitles?: boolean;
}

const LogInForm: React.FC<LogInFormProps> = ({
    titleText, reasonText, onSuccess,
    includeLogo = false,
    registrationEnabled = true,
    showTitles = true
}) => {
    const { session, updateSession } = useSessionContext();
    const [enteredPhone, setEnteredPhone] = useState<string | null>(null);
    const [loginStarted, setLoginStarted] = useState(false);
    const [performRegistration, setPerformRegistration] = useState(false);

    const [timer, setTimer] = useState(60);
    const [isSendAgainButtonDisabled, setIsSendAgainButtonDisabled] =
        useState(true);

    const [otpInput, setOtpInput] = useState<string>("");
    const phoneInputRef = React.createRef();

    // Register Form (get phone number from user)
    const {
        control: registerFormControl,
        handleSubmit: registerFormHandleSubmit,
        setError: registerFormSetError,
        getValues: registerFormGetValues
    } = useForm<User & { name?: string }>({
        shouldUnregister: false,
        mode: "onSubmit",
        criteriaMode: "all",
        defaultValues: {
            name: "",
            phone: "",
        },
    });

    const onRegisterSubmit: SubmitHandler<User> = async (data: User) => {
        try {
            const responce = await loginGetSmsCode({
                body: { phone: data.phone.replace(/\D/g, "") },
            });
            if (responce) {
                const phoneNumber = parsePhoneNumber(data.phone, "RU");
                loginFormSetValue("username", phoneNumber ? phoneNumber.formatInternational() : "");
                setEnteredPhone(data.phone.replace(/\D/g, ""));
            }
        } catch (err) {
            registerFormSetError("phone", {
                type: "value",
                message: "Something went wrong, try again later...",
            });
        }
    };

    // Login Form (get otp code from user)
    const {
        handleSubmit: loginFormHandleSubmit,
        setValue: loginFormSetValue,
        setError: loginFormSetError,
        formState: { errors: loginFormErrors, isSubmitting: isLoginFormSubmitting }
    } = useForm<UserLogin>({
        mode: "onSubmit",
        criteriaMode: "all",
    });

    const onLoginSubmit: SubmitHandler<UserLogin> = async (data: UserLogin) => {
        try {
            await loginLogin({
                body: {
                    username: data.username.replace(/\D/g, ""),
                    password: data.password,
                },
                throwOnError: true
            });
            updateSession();
            const regFormValues = registerFormGetValues();
            if (regFormValues.name && regFormValues.name.length > 0) {
                await usersUpdateUserMe({
                    body: {
                        name: regFormValues.name
                    }
                })
            }
            onSuccess && onSuccess();
        } catch (error) {
            if ((error as AxiosError).status === 400) {
                loginFormSetError("password", {
                    type: "pattern",
                    message: "The code is incorrect",
                });
            }
        }
    };

    useEffect(() => {
        loginFormSetValue("password", otpInput);
        if (otpInput.length >= 4) {
            loginFormHandleSubmit(onLoginSubmit)();
        }
    }, [otpInput]);

    // Send OTP code again
    const handleSendAgain = async () => {
        try {
            registerFormHandleSubmit(onRegisterSubmit)();
            setTimer(90);
            setIsSendAgainButtonDisabled(true);
        } catch (err) {
            setIsSendAgainButtonDisabled(true);
            setEnteredPhone(null);
            registerFormSetError("phone", {
                type: "value",
                message: "Something went wrong, try again later...",
            });
        }
    };

    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
        setIsSendAgainButtonDisabled(false);
    }, [timer]);

    useEffect(() => {
        // Reset timer on mount
        setTimer(60);
        setIsSendAgainButtonDisabled(true);
    }, []);

    if (session) return null;

    if (enteredPhone) {
        return (
            <FormWrapper>
                <VStack gap="$40" style={{ flex: 1, alignItems: "center" }}>
                    {includeLogo && <Logo />}
                    {showTitles ? performRegistration ? (
                        <Text size="display2">Registration</Text>
                    ) : (
                        <Text size="display2">Login</Text>
                    ) : null}
                    <VStack gap="$16" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <VStack gap="$16" style={{ alignItems: "center" }}>
                            <Text size="textM">Enter the code from SMS</Text>
                            <FormControl
                                isDisabled={isLoginFormSubmitting}
                                isInvalid={!!loginFormErrors.password}
                                isReadOnly={isLoginFormSubmitting}
                                isRequired={true}
                            >
                                <OTPTextView
                                    handleTextChange={setOtpInput}
                                    inputCount={4}
                                />
                                <FormControl.Error>
                                    <FormControl.ErrorText>
                                        {loginFormErrors?.password?.message}
                                    </FormControl.ErrorText>
                                </FormControl.Error>
                            </FormControl>
                            {isSendAgainButtonDisabled && !isLoginFormSubmitting && (
                                <Text size="textM" style={{ color: "var(--color-text-light)" }}>
                                    Send again in{" "}{toHHMMSS(timer)}{" "}seconds.
                                </Text>
                            )}
                            {!isSendAgainButtonDisabled && !isLoginFormSubmitting && (
                                <Button onClick={handleSendAgain} variant="primary" size="medium">
                                    Send the code again
                                </Button>
                            )}
                        </VStack>
                    </VStack>
                    <FormControl>
                        <Button
                            disabled={false}
                            onClick={loginFormHandleSubmit(onLoginSubmit)}
                            variant="primary"
                            size="medium"
                        >Next</Button>
                    </FormControl>
                </VStack>
            </FormWrapper>
        )
    } else if (loginStarted) {
        return (
            <FormWrapper>
                <form onSubmit={registerFormHandleSubmit(onRegisterSubmit)} style={{ width: "100%" }}>
                    <VStack gap="$40" style={{ flex: 1, alignItems: "center" }}>
                        {includeLogo && <Logo />}
                        {showTitles ? performRegistration ? (
                            <Text size="display2">Registration</Text>
                        ) : (
                            <Text size="display2">Login</Text>
                        ) : null}
                        <VStack gap="$24">
                            {performRegistration && (
                                <Controller
                                    control={registerFormControl}
                                    name="name"
                                    render={({ field, fieldState: { invalid, error }, formState: { isSubmitting } }) => (
                                        <FormControl
                                            isDisabled={isSubmitting}
                                            isInvalid={invalid}
                                            isReadOnly={isSubmitting}
                                            style={{ alignItems: "center", width: "100%" }}
                                        >
                                            <VStack gap="$16" style={{ alignItems: "center" }}>
                                                <Text size="textS">Name or nickname</Text>
                                                <Input style={{ flex: 1, minWidth: 300 }}>
                                                    <Input.Field
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        onBlur={field.onBlur}
                                                    />
                                                </Input>
                                                <FormControl.Error>
                                                    <FormControl.ErrorText>
                                                        {error?.message}
                                                    </FormControl.ErrorText>
                                                </FormControl.Error>
                                            </VStack>
                                        </FormControl>
                                    )}
                                />
                            )}
                            <Controller
                                control={registerFormControl}
                                name="phone"
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Обязательное поле",
                                    },
                                }}
                                render={({ field, fieldState: { invalid, error }, formState: { isSubmitting } }) => (
                                    <FormControl
                                        isDisabled={isSubmitting}
                                        isInvalid={invalid}
                                        isReadOnly={isSubmitting}
                                        isRequired={true}
                                        style={{ alignItems: "center", width: "100%" }}
                                    >
                                        <VStack gap="$16" style={{ alignItems: "center" }}>
                                            <Text size="textS">Phone number</Text>
                                            <Input style={{ flex: 1, minWidth: 300 }}>
                                                <PhoneInput
                                                    name="phone"
                                                    country="RU"
                                                    international
                                                    withCountryCallingCode
                                                    countryCallingCodeEditable={false}
                                                    smartCaret={false}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    // @ts-ignore
                                                    inputComponent={Input.Field}
                                                    ref={phoneInputRef}
                                                    type="text"
                                                    keyboardType="phone-pad"
                                                    autoComplete="tel"
                                                    inputMode="tel"
                                                    returnKeyType="next"
                                                    placeholder="Обязательное поле"
                                                    onKeyPress={(e: React.KeyboardEvent) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault(); // Prevent default "Enter" behavior
                                                            registerFormHandleSubmit(onRegisterSubmit)();
                                                        }
                                                    }}
                                                />
                                            </Input>
                                            <FormControl.Error>
                                                <FormControl.ErrorText>
                                                    {error?.message}
                                                </FormControl.ErrorText>
                                            </FormControl.Error>
                                        </VStack>
                                    </FormControl>
                                )}
                            />
                        </VStack>
                        <FormControl>
                            <Button
                                disabled={false}
                                type="submit" // Add the type="submit" attribute for default form behavior
                                variant="secondary"
                                size="medium"
                                style={{ paddingLeft: "var(--space-40)", paddingRight: "var(--space-40)" }}
                            >Next</Button>
                        </FormControl>
                    </VStack>
                </form >
            </FormWrapper>
        )
    } else {
        return (
            <FormWrapper>
                <VStack gap="$56" style={{ flex: 1, alignItems: "center" }}>
                    {includeLogo && <Logo />}
                    <VStack gap="$32" style={{ flex: 1, alignItems: "center", textAlign: "center" }}>
                        <VStack gap="$12">
                            {titleText && <Text size="display2">{titleText}</Text>}
                            <Text size="textS">{reasonText || "Для продолжения войдите в аккаунт или зарегистрируйтесь"}</Text>
                        </VStack>
                        {registrationEnabled ? (
                            <Button
                                variant="primary"
                                size="medium"
                                style={{ paddingLeft: "var(--space-40)", paddingRight: "var(--space-40)" }}
                                onClick={() => { setPerformRegistration(true); setLoginStarted(true) }}
                            >
                                Register
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                size="medium"
                                style={{ paddingLeft: "var(--space-40)", paddingRight: "var(--space-40)" }}
                                onClick={() => { setLoginStarted(true) }}
                            >
                                Login
                            </Button>
                        )}
                    </VStack>
                    {registrationEnabled && (
                        <HStack style={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <Text size="textM">Already with us?</Text>
                            <Button variant="secondary" size="medium"
                                onClick={() => setLoginStarted(true)}
                            >Login</Button>
                        </HStack>
                    )}
                </VStack>
            </FormWrapper>
        )
    };
};

export default LogInForm;


const FormWrapper = styled.div`
    width: 400px;

    @media (max-width: ${breakpoints.tablet}) {
      width: 100%;
    }
`