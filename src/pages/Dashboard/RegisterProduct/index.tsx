import React, { useCallback, useRef, useState } from 'react';
import {
    Container,
    TitleTextContainer,
    TitleText,
    ImagePicker,
    ImageHighlight,
    BarCodeScannerContainer,
    BarCodeValue,
    BarCodeButton,
} from './styles';
import { Alert, ScrollView, TextInput } from 'react-native';
import { useAuth } from '../../../hooks/auth';
import { useCamera } from '../../../hooks/camera';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/mobile';
import { launchImageLibrary } from 'react-native-image-picker/src';
import { useNavigation } from '@react-navigation/native';

import api from '../../../services/api';
import Camera from '../../../components/Camera';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Icon from 'react-native-vector-icons/MaterialIcons';
import getValidationErrors from '../../../utils/getValidationErrors';
import * as yup from 'yup';

interface IProduct {
    productName: string;
    price: number;
    quantity: number;
    brand: string;
    barCode?: string;
    image?: string;
}

interface ImageData {
    name: string;
    type: string;
    uri: string;
}

const RegisterProduct: React.FC = () => {
    const { user } = useAuth();

    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const priceInput = useRef<TextInput>(null);
    const brandInput = useRef<TextInput>(null);
    const quantityInput = useRef<TextInput>(null);
    const { isCameraVisible, handleCameraVisibility } = useCamera();

    const [barCodeValue, setBarCodeValue] = useState(0);
    const [selectedImage, setSelectedImage] = useState<ImageData>(
        {} as ImageData,
    );

    const handleBarCodeRead = useCallback(
        value => {
            setBarCodeValue(value);
            handleCameraVisibility(false);
        },
        [handleCameraVisibility],
    );

    const handleUploadImage = useCallback(() => {
        launchImageLibrary(
            {
                mediaType: 'photo',
            },
            ({ fileName, uri, type, didCancel }) => {
                if (!didCancel && uri && fileName && type) {
                    setSelectedImage({
                        name: fileName,
                        type,
                        uri,
                    });
                }
            },
        );
    }, []);

    const handleSubmit = useCallback(
        async (data: IProduct = { quantity: 0 } as IProduct) => {
            try {
                const schema = yup.object().shape({
                    productName: yup
                        .string()
                        .required('Nome do produto obrigatório'),
                    price: yup
                        .number()
                        .required('Preço do produto obrigatório'),
                    brand: yup
                        .string()
                        .required('Marca do produto obrigatória'),
                    quantity: yup.number().default(0),
                    barCode: yup.string().optional(),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const productData = new FormData();

                productData.append('name', data.productName);
                productData.append('price', data.price);
                productData.append('brand', data.brand);
                productData.append('quantity', data.quantity);

                if (data.barCode) {
                    productData.append('barCode', data.barCode);
                }

                if (selectedImage.uri) {
                    productData.append('image', {
                        uri: selectedImage.uri,
                        name: `${data.productName}-${user.companyId}`,
                        type: selectedImage.type,
                    });
                }

                await api.post('/products/add', productData);

                navigation.navigate('Estoque');

                Alert.alert('Produto adicionado com sucesso!');
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
                    'Ocorreu algum problema na aplicação, por favor, tente novamente.',
                );
            }
        },
        [selectedImage, user.companyId, navigation],
    );

    return isCameraVisible ? (
        <Camera
            onBarCodeRead={event => {
                handleBarCodeRead(event.data);
            }}
        />
    ) : (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <Container>
                <TitleTextContainer style={{ elevation: 10 }}>
                    <TitleText>Dados do produto</TitleText>
                </TitleTextContainer>

                <Form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    style={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Input
                        autoCorrect={false}
                        autoCapitalize="sentences"
                        name="productName"
                        placeholder="Nome"
                        icon="label-outline"
                        onSubmitEditing={() => {
                            priceInput.current?.focus();
                        }}
                        returnKeyType="next"
                    />

                    <Input
                        keyboardType="numeric"
                        name="price"
                        ref={priceInput}
                        placeholder="Preço"
                        icon="attach-money"
                        onSubmitEditing={() => {
                            brandInput.current?.focus();
                        }}
                        returnKeyType="next"
                    />

                    <Input
                        autoCapitalize="words"
                        name="brand"
                        placeholder="Marca"
                        icon="tag"
                        ref={brandInput}
                        onSubmitEditing={() => {
                            quantityInput.current?.focus();
                        }}
                        returnKeyType="next"
                    />

                    <Input
                        keyboardType="numeric"
                        name="quantity"
                        ref={quantityInput}
                        placeholder="Quantidade em estoque"
                        icon="inbox"
                        returnKeyType="next"
                    />

                    <BarCodeScannerContainer>
                        <Icon
                            name="qr-code"
                            size={24}
                            style={{ position: 'absolute', left: 12 }}
                            color={barCodeValue ? '#374b92' : 'black'}
                        />
                        <BarCodeValue>
                            {barCodeValue
                                ? barCodeValue
                                : 'Sem código inserido'}
                        </BarCodeValue>

                        <BarCodeButton
                            onPress={() => handleCameraVisibility(true)}
                            activeOpacity={0.4}
                        >
                            <Icon name="qr-code-scanner" size={24} />
                        </BarCodeButton>
                    </BarCodeScannerContainer>

                    <ImagePicker
                        onPress={handleUploadImage}
                        activeOpacity={0.7}
                    >
                        {selectedImage.uri ? (
                            <ImageHighlight
                                source={{
                                    uri: selectedImage.uri,
                                }}
                            />
                        ) : (
                            <Icon name="add" size={44} color="#1c274e" />
                        )}
                    </ImagePicker>
                </Form>

                <Button
                    biggerText
                    onPress={() => {
                        formRef.current?.submitForm();
                    }}
                >
                    Cadastrar Produto
                </Button>
            </Container>
        </ScrollView>
    );
};

export default RegisterProduct;
