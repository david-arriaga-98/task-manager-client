import { FC, useState } from 'react';
import {
	Modal,
	ModalBody,
	ModalHeader,
	FormGroup,
	Label,
	Input,
	Form,
	ModalFooter,
	Button,
	Row,
	Col
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Axios from '../../utils/axios';
import { ISuccessResponse } from '../../utils/managePetitions';
import { SHOW_NOTIFICATION } from '../../store/ducks/notification.duck';
import React from 'react';
import { IRegister } from '../../models/User';

type createUserProps = {
	modal: boolean;
	toggle: () => void;
	reload: () => void;
};

const CreateUser: FC<createUserProps> = ({ modal, toggle, reload }) => {
	const {
		handleSubmit,
		register,
		formState: { errors },
		reset,
		watch
	} = useForm();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch = useDispatch();

	const onSubmit = async (values: IRegister) => {
		try {
			setIsLoading(true);
			const { data } = await Axios.post<ISuccessResponse<null>>(
				'/user/register',
				{
					...values,
					role: values.role === 'Administrador' ? 'ADMIN' : 'USER'
				}
			);
			setIsLoading(false);
			reset();
			toggle();
			dispatch(
				SHOW_NOTIFICATION({
					message: data.message,
					type: 'success'
				})
			);
			reload();
		} catch (error) {
			setIsLoading(false);
			dispatch(
				SHOW_NOTIFICATION({
					message: error.response.data.message,
					type: 'error'
				})
			);
		}
	};

	return (
		<Modal isOpen={modal} toggle={toggle}>
			<Form onSubmit={handleSubmit<IRegister>(onSubmit)}>
				<ModalHeader toggle={toggle}>Ingrese un usuario</ModalHeader>
				<ModalBody>
					<FormGroup>
						<Label for="names">Nombres</Label>
						<Input
							type="text"
							id="names"
							disabled={isLoading}
							{...register('names', {
								required: {
									value: true,
									message: 'Este campo es requerido'
								},
								maxLength: {
									value: 80,
									message: 'Este campo debe tener máximo 80 carácteres'
								},
								minLength: {
									value: 3,
									message: 'Este campo debe tener mínimo 3 carácteres'
								}
							})}
						/>
						<span
							className="mt-1"
							style={{ fontSize: '12px', color: '#DC2626' }}
						>
							{errors.names && errors.names.message}
						</span>
					</FormGroup>

					<Row>
						<Col>
							<FormGroup>
								<Label for="username">Usuario</Label>
								<Input
									disabled={isLoading}
									type="text"
									id="username"
									{...register('username', {
										required: {
											value: true,
											message: 'Este campo es requerido'
										},
										maxLength: {
											value: 20,
											message: 'Este campo debe tener máximo 20 carácteres'
										},
										minLength: {
											value: 3,
											message: 'Este campo debe tener mínimo 3 carácteres'
										}
									})}
								/>
								<span
									className="mt-1"
									style={{ fontSize: '12px', color: '#DC2626' }}
								>
									{errors.username && errors.username.message}
								</span>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup>
								<Label for="role">Rol</Label>
								<Input
									disabled={isLoading}
									{...register('role')}
									type="select"
									id="role"
								>
									<option>Usuario</option>
									<option>Administrador</option>
								</Input>
								<span
									className="mt-1"
									style={{ fontSize: '12px', color: '#DC2626' }}
								>
									{errors.role && errors.role.message}
								</span>
							</FormGroup>
						</Col>
					</Row>

					<FormGroup>
						<Label for="email">Correo electrónico</Label>
						<Input
							disabled={isLoading}
							type="text"
							id="email"
							{...register('email', {
								required: {
									value: true,
									message: 'Este campo es requerido'
								},
								pattern: {
									value:
										/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
									message: 'Este correo tiene un formato inválido'
								},
								maxLength: {
									value: 100,
									message: 'Este campo debe tener máximo 100 carácteres'
								},
								minLength: {
									value: 5,
									message: 'Este campo debe tener mínimo 5 carácteres'
								}
							})}
						/>
						<span
							className="mt-1"
							style={{ fontSize: '12px', color: '#DC2626' }}
						>
							{errors.email && errors.email.message}
						</span>
					</FormGroup>

					<Row>
						<Col>
							<FormGroup>
								<Label for="password">Contraseña:</Label>
								<Input
									disabled={isLoading}
									type="password"
									id="password"
									{...register('password', {
										required: {
											value: true,
											message: 'Este campo es requerido'
										},
										maxLength: {
											value: 90,
											message: 'Este campo debe tener máximo 90 carácteres'
										},
										minLength: {
											value: 5,
											message: 'Este campo debe tener mínimo 5 carácteres'
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
						</Col>
						<Col>
							<FormGroup>
								<Label for="passwordConfirm">Confirmar contraseña:</Label>
								<Input
									disabled={isLoading}
									type="password"
									id="passwordConfirm"
									{...register('passwordConfirm', {
										required: {
											value: true,
											message: 'Este campo es requerido'
										},
										maxLength: {
											value: 90,
											message: 'Este campo debe tener máximo 90 carácteres'
										},
										minLength: {
											value: 5,
											message: 'Este campo debe tener mínimo 5 carácteres'
										},
										validate: (value) =>
											value === watch('password') ||
											'Las contraseñas no coinciden'
									})}
								/>
								<span
									className="mt-1"
									style={{ fontSize: '12px', color: '#DC2626' }}
								>
									{errors.passwordConfirm && errors.passwordConfirm.message}
								</span>
							</FormGroup>
						</Col>
					</Row>
				</ModalBody>
				<ModalFooter>
					<Button disabled={isLoading} color="info" type="submit" size="md">
						Registrar usuario
					</Button>
					<Button
						disabled={isLoading}
						color="danger"
						size="md"
						onClick={toggle}
					>
						Cancelar
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	);
};

export default React.memo(CreateUser);
