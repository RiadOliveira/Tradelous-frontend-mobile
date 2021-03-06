import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RectButton } from 'react-native-gesture-handler';

interface EmployeeInterface {
    isAdmin: boolean;
}

export const Container = styled.View`
    background-color: #49b454;
    flex: 1;
    flex-direction: column;
    align-items: center;
    padding-bottom: 30px;
`;

export const CompanyContainer = styled.View`
    width: 80%;
    flex-direction: row;
    align-items: center;
    margin: 10% 0;
    position: relative;
`;

export const LogoContainer = styled.View`
    width: 110px;
    height: 110px;
    background-color: #5170e0;
    border-radius: 55px;
    justify-content: center;
    align-items: center;
    border: 3px solid #1c274e;
`;

export const CompanyImage = styled.Image`
    width: 106px;
    height: 106px;
    border-radius: 53px;
`;

export const CompanyData = styled.View`
    background-color: #1c274e;
    height: 110px;
    width: 90%;
    justify-content: center;
    align-items: flex-start;
    position: absolute;
    left: 10%;
    border-radius: 20px;
`;

export const CompanyName = styled.Text`
    font-family: Poppins-Bold;
    font-size: 18px;
    color: #ffffff;
    margin-left: 30%;
`;

export const CompanyAdress = styled.Text`
    font-family: Poppins-Bold;
    font-size: 10px;
    color: #ffffff;
    margin-left: 30.5%;
`;

export const EditButton = styled(RectButton)`
    position: absolute;
    right: 4%;
    bottom: 10%;
`;

export const EditIcon = styled(Icon)``;

export const Employee = styled.View`
    width: 66%;
    flex-direction: row;
    position: relative;
    margin-bottom: 4%;
`;

export const EmployeeData = styled.View<EmployeeInterface>`
    background-color: ${props => (props.isAdmin ? '#1c274e' : '#2c3f82')};
    height: 60px;
    width: 97%;
    position: absolute;
    justify-content: center;
    align-items: flex-start;
    left: 5%;
    border-radius: 20px;
`;

export const EmployeeName = styled.Text`
    margin-left: 10px;
    font-family: Poppins-Bold;
    font-size: 14px;
    color: #ffffff;
    margin-left: 22%;
`;

export const EmployeeEmail = styled.Text`
    margin-left: 10px;
    font-family: Poppins-Bold;
    font-size: 8.5px;
    color: #ffffff;
    margin-left: 22.5%;
`;

export const EmployeeImage = styled.Image`
    width: 58px;
    height: 58px;
    border-radius: 29px;
`;

export const EmployeeIcon = styled.View<EmployeeInterface>`
    width: 60px;
    height: 60px;
    background-color: #5170e0;
    border-radius: 30px;
    justify-content: center;
    align-items: center;
    border: 2px solid ${props => (props.isAdmin ? '#1c274e' : '#2c3f82')};
`;
