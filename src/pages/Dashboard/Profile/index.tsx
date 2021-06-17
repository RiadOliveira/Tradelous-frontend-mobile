import React, { useCallback, useRef, useState } from 'react';
import {
    Container,
    Header,
    ProfileImage,
    SignOutButton,
    SignOutButtonText,
    ImagePicker,
    ImageContainer,
    DeleteImageButton,
} from './styles';
import { Alert, ScrollView, TextInput } from 'react-native';
import { useAuth } from '@hooks/auth';
import Input from '@components/Input';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import Button from '@components/Button';
import api from '@services/api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as yup from 'yup';
import { launchImageLibrary } from 'react-native-image-picker/src';
import getValidationErrors from '@utils/getValidationErrors';

interface UpdateProfileData {
    name: string;
    email: string;
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const Profile: React.FC = () => {
    const { signOut, updateUser, updateUsersAvatar, user } = useAuth();
    const formRef = useRef<FormHandles>(null);
    const emailInput = useRef<TextInput>(null);
    const oldPasswordInput = useRef<TextInput>(null);
    const newPasswordInput = useRef<TextInput>(null);
    const confirmPasswordInput = useRef<TextInput>(null);

    const [selectedImage, setSelectedImage] = useState(() =>
        user.avatar
            ? `${api.defaults.baseURL}/files/avatar/${user.avatar}`
            : '',
    );

    const handleSubmit = useCallback(
        async (userData: UpdateProfileData) => {
            try {
                const schema = yup.object().shape({
                    name: yup.string().required('Nome obrigatório'),
                    email: yup
                        .string()
                        .required('E-mail obrigatório')
                        .email('Formato de e-mail incorreto'),
                    oldPassword: yup.string().optional(),
                    newPassword: yup.string().optional(),
                    confirmPassword: yup.string().when('newPassword', {
                        is: (value: string) => !!value,
                        then: yup
                            .string()
                            .required('Confirmação de senha obrigatória')
                            .oneOf(
                                [yup.ref('newPassword'), null],
                                'As senhas precisam ser iguais',
                            )
                            .min(6, 'Senha de, no mínimo, 6 caracteres'),
                        otherwise: yup.string(),
                    }),
                });

                await schema.validate(userData, {
                    abortEarly: false,
                });

                await updateUser(userData);

                if (userData.newPassword) {
                    formRef.current?.clearField('oldPassword');
                    formRef.current?.clearField('newPassword');
                    formRef.current?.clearField('confirmPassword');
                }

                Alert.alert(
                    'Atualização concluída!',
                    'A alteração dos dados foi efetuada com sucesso.',
                );
            } catch (err) {
                if (err instanceof yup.ValidationError) {
                    const validationErrors = getValidationErrors(err);

                    const validationKeys = Object.keys(validationErrors);

                    formRef.current?.setErrors(validationErrors);

                    Alert.alert(
                        'Problema na validação',
                        `${validationErrors[validationKeys[0]]}.`,
                    );

                    return;
                }

                Alert.alert(
                    'Problema inesperado',
                    'Ocorreu algum problema, por favor, tente novamente.',
                );
            }
        },
        [updateUser],
    );

    const handleImageData = useCallback(
        async (handleMode: 'upload' | 'delete') => {
            if (handleMode == 'delete') {
                if (!selectedImage) {
                    Alert.alert(
                        'Operação indisponível',
                        'Nenhuma imagem para ser deletada.',
                    );
                } else {
                    Alert.alert(
                        'Deletar imagem',
                        'Você deseja mesmo continuar com a exclusão da imagem?',
                        [
                            {
                                text: 'Continuar',
                                onPress: async () => {
                                    try {
                                        await updateUsersAvatar('');
                                        setSelectedImage('');
                                    } catch {
                                        Alert.alert(
                                            'Falha na exclusão',
                                            'Ocorreu um erro ao tentar excluir o avatar.',
                                        );
                                    }
                                },
                            },
                            { text: 'Cancelar' },
                        ],
                    );
                }
            } else {
                launchImageLibrary(
                    {
                        mediaType: 'photo',
                    },
                    async ({ fileName, uri, type, didCancel }) => {
                        if (!didCancel && uri && fileName && type) {
                            try {
                                await updateUsersAvatar(uri);
                                setSelectedImage(uri);
                            } catch {
                                Alert.alert(
                                    'Falha na atualização',
                                    'Ocorreu um erro ao tentar atualizar o avatar.',
                                );
                            }
                        }
                    },
                );
            }
        },
        [updateUsersAvatar, selectedImage],
    );

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <Container>
                <Header>
                    <SignOutButton onPress={() => signOut()}>
                        <SignOutButtonText>Sair</SignOutButtonText>
                    </SignOutButton>
                </Header>

                <ImageContainer>
                    <ImagePicker
                        onPress={() => handleImageData('upload')}
                        activeOpacity={0.7}
                        selectedImage={selectedImage}
                    >
                        {selectedImage ? (
                            <ProfileImage
                                source={{
                                    uri: selectedImage,
                                }}
                            />
                        ) : (
                            <Icon name="person" size={170} color="#1c274e" />
                        )}
                    </ImagePicker>

                    <DeleteImageButton
                        onPress={() => handleImageData('delete')}
                    >
                        <Icon name="clear" size={48} color="#e7e7e7" />
                    </DeleteImageButton>
                </ImageContainer>

                <Form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    initialData={{ name: user.name, email: user.email }}
                >
                    <Input
                        autoCorrect={false}
                        textContentType="username"
                        autoCapitalize="words"
                        name="name"
                        placeholder="Nome"
                        icon="person-outline"
                        onSubmitEditing={() => {
                            emailInput.current?.focus();
                        }}
                        returnKeyType="next"
                    />

                    <Input
                        autoCorrect={false}
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        ref={emailInput}
                        name="email"
                        placeholder="E-mail"
                        icon="mail-outline"
                        onSubmitEditing={() => {
                            oldPasswordInput.current?.focus();
                        }}
                        returnKeyType="next"
                    />

                    <Input
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="password"
                        secureTextEntry
                        name="oldPassword"
                        placeholder="Senha antiga"
                        icon="lock-outline"
                        ref={oldPasswordInput}
                        onSubmitEditing={() => {
                            newPasswordInput.current?.focus();
                        }}
                    />

                    <Input
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="newPassword"
                        secureTextEntry
                        name="newPassword"
                        placeholder="Nova senha"
                        icon="lock-outline"
                        ref={newPasswordInput}
                        onSubmitEditing={() => {
                            confirmPasswordInput.current?.focus();
                        }}
                    />

                    <Input
                        returnKeyType="next"
                        autoCapitalize="none"
                        textContentType="newPassword"
                        secureTextEntry
                        name="confirmPassword"
                        placeholder="Confirmar senha"
                        icon="lock-outline"
                        ref={confirmPasswordInput}
                        onSubmitEditing={() => {
                            formRef.current?.submitForm();
                        }}
                    />
                </Form>

                <Button
                    biggerText
                    onPress={() => formRef.current?.submitForm()}
                >
                    Atualizar dados
                </Button>
            </Container>
        </ScrollView>
    );
};

export default Profile;
