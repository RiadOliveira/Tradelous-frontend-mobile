import React, {useCallback, useRef} from 'react';
import {
    Container,
    LogoView,
    LogoImage,
    ForgotPassword,
    ForgotPasswordText,
    SignUp,
    SignUpText,
} from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import TestLogo from '../../../assets/Logo/Test-logo.png';
import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import {TextInput} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordInput = useRef<TextInput>(null);

    const handleSubmit = useCallback((data) => {
        console.log(data);
    }, []);

    return (
        <ScrollView
            contentContainerStyle={{flex: 1}}
            keyboardShouldPersistTaps="handled">
            <Container>
                <LogoView>
                    <LogoImage source={TestLogo} />
                </LogoView>

                <Form ref={formRef} onSubmit={handleSubmit}>
                    <Input
                        autoCorrect={false}
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        name="E-mail"
                        icon="mail-outline"
                        onSubmitEditing={() => {
                            passwordInput.current?.focus();
                        }}
                        returnKeyType="next"
                    />

                    <Input
                        returnKeyType="send"
                        autoCapitalize="none"
                        textContentType="password"
                        secureTextEntry
                        name="Senha"
                        icon="lock-outline"
                        ref={passwordInput}
                        onSubmitEditing={() => {
                            formRef.current?.submitForm();
                        }}
                    />
                </Form>

                <ForgotPassword>
                    <ForgotPasswordText>Esqueceu sua senha?</ForgotPasswordText>
                </ForgotPassword>

                <Button
                    onPress={() => {
                        formRef.current?.submitForm();
                    }}>
                    Entrar
                </Button>

                <SignUp>
                    <SignUpText>
                        Ainda não possui uma conta? Crie-a agora
                    </SignUpText>
                </SignUp>
            </Container>
        </ScrollView>
    );
};

export default SignIn;