import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useForm } from 'react-hook-form';
import CloudImage from '../assets/images/cloud.svg';
import { ILogin, IUser } from '../models/User';
import { executeServerPetition } from '../utils/managePetitions';
import { encryptData } from '../utils/manageUser';
import { useDispatch, useSelector } from 'react-redux';
import {
	ERROR_LOGIN,
	IUserState,
	START_LOGIN,
	SUCCESS_LOGIN
} from '../store/ducks/user.duck';
import { IApplicationState } from '../store/ducks';
import { push } from 'connected-react-router';
import NoSessionLayout from '../components/Layouts/NoSessionLayout';
import { SHOW_NOTIFICATION } from '../store/ducks/notification.duck';

const Login = () => {
	const {
		handleSubmit,
		register,
		formState: { errors }
	} = useForm();

	const dispatch = useDispatch();

	const state = useSelector<IApplicationState, IUserState>(
		(state) => state.user
	);

	const onSubmit = async (value: ILogin) => {
		try {
			dispatch(START_LOGIN());
			const { data } = await executeServerPetition<ILogin, IUser>(
				'POST',
				'/user/login',
				value
			);
			dispatch(SUCCESS_LOGIN({ userData: data }));
			encryptData(data);
			dispatch(push('/dashboard'));

			return;
		} catch (error) {
			dispatch(
				SHOW_NOTIFICATION({
					message: error.response.data.message,
					type: 'error'
				})
			);
			dispatch(ERROR_LOGIN({ errorMessage: error.response.data.message }));
		}
	};

	return (
		<NoSessionLayout>
			<Row className="d-flex align-items-center justify-content-center">
				<Col md="5">
					<img src={CloudImage} width="100%" alt="Logo" />
				</Col>
				<Col md="4">
					<h2 className="mb-2">Bienvenido a Task Manager</h2>
					<Form onSubmit={handleSubmit(onSubmit)}>
						<FormGroup>
							<Label for="credential">Usuario o correo electrónico:</Label>
							<Input
								disabled={state.isLoading}
								type="text"
								id="credential"
								{...register('credential', {
									required: {
										value: true,
										message: 'Este campo es requerido'
									}
								})}
							/>
							<span
								className="mt-1"
								style={{ fontSize: '12px', color: '#DC2626' }}
							>
								{errors.credential && errors.credential.message}
							</span>
						</FormGroup>

						<FormGroup>
							<Label for="password">Contraseña:</Label>
							<Input
								disabled={state.isLoading}
								type="password"
								id="password"
								{...register('password', {
									required: {
										value: true,
										message: 'La contraseña es requerida'
									}
								})}
							/>
							<span
								className="mt-1"
								style={{ fontSize: '12px', color: '#DC2626' }}
							>
								{errors.password && errors.password.message}
							</span>
						</FormGroup>
						<FormGroup>
							<Button
								color="info"
								type="submit"
								size="md"
								disabled={state.isLoading}
							>
								Iniciar sesión
							</Button>
						</FormGroup>
					</Form>
				</Col>
			</Row>
		</NoSessionLayout>
	);
};

export default Login;
